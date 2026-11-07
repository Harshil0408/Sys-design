import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { execSync, spawn } from "node:child_process";
import * as path from "node:path";

async function checkK6Installed(): Promise<boolean> {
  try {
    execSync("k6 version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

async function checkDockerInstalled(): Promise<boolean> {
  try {
    execSync("docker --version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function renderProgressBar(percent: number, width = 20): string {
  const p = Math.max(0, Math.min(100, percent));
  const filled = Math.floor((p / 100) * width);
  return "█".repeat(filled) + "░".repeat(width - filled);
}

async function main() {
  const rl = readline.createInterface({ input, output });

  console.log("\n==============================================");
  console.log("       Grafana k6 Load Test Runner");
  console.log("==============================================\n");

  const vusInput = await rl.question("Enter number of Virtual Users (VUs) [default: 1500]: ");
  const vus = parseInt(vusInput.trim() || "1500", 10);

  const durationInput = await rl.question("Enter test duration in seconds [default: 30]: ");
  const durationSec = parseInt(durationInput.trim() || "30", 10);

  console.log("\nSelect target API endpoint:");
  console.log("  1) All Endpoints (Distributed load)");
  console.log("  2) Cities API (/api/v1/cities)");
  console.log("  3) Shows API (/api/v1/shows)");
  console.log("  4) Cinemas API (/api/v1/cinemas)");
  console.log("  5) Health API (/health)");
  const endpointChoice = await rl.question("Choice [1-5, default: 1]: ");

  let endpoint = "all";
  let endpointLabel = "All APIs (Distributed)";
  switch (endpointChoice.trim()) {
    case "2":
      endpoint = "cities";
      endpointLabel = "Cities API (/api/v1/cities)";
      break;
    case "3":
      endpoint = "shows";
      endpointLabel = "Shows API (/api/v1/shows)";
      break;
    case "4":
      endpoint = "cinemas";
      endpointLabel = "Cinemas API (/api/v1/cinemas)";
      break;
    case "5":
      endpoint = "health";
      endpointLabel = "Health API (/health)";
      break;
    default:
      endpoint = "all";
      endpointLabel = "All APIs (Distributed)";
      break;
  }

  rl.close();

  console.log("\n" + "=".repeat(62));
  console.log("   LIVE LOAD TEST DASHBOARD");
  console.log("=".repeat(62));
  // Print initial 4 lines
  process.stdout.write("┌────────────────────────────────────────────────────────────┐\n");
  process.stdout.write("│ ⚡ Target Endpoint  : " + endpointLabel.padEnd(35) + " │\n");
  process.stdout.write("│ 📊 Requests Processed: 0 reqs (0.00/s)                     │\n");
  process.stdout.write("│ ⏳ Time Elapsed      : 0s / " + String(durationSec) + "s [░░░░░░░░░░░░░░░░░░░░] 0%   │\n");
  process.stdout.write("│ 👥 Virtual Users     : " + (vus + " Active VUs").padEnd(35) + " │\n");
  process.stdout.write("└────────────────────────────────────────────────────────────┘\n");

  const startTime = Date.now();
  let completedRequests = 0;
  let finalSummary = "";
  let isCapturingSummary = false;

  const updateDashboard = (completed: number) => {
    const elapsedMs = Date.now() - startTime;
    const elapsedSec = Math.min(durationSec, Math.floor(elapsedMs / 1000));
    const percent = Math.min(100, Math.floor((elapsedSec / durationSec) * 100));
    const rps = elapsedSec > 0 ? (completed / elapsedSec).toFixed(1) : "0.0";
    const bar = renderProgressBar(percent, 20);

    const line1 = `│ ⚡ Target Endpoint  : ${endpointLabel.slice(0, 35).padEnd(35)} │`;
    const line2 = `│ 📊 Requests Processed: ${(completed.toLocaleString() + " reqs (" + rps + "/s)").padEnd(35)} │`;
    const line3 = `│ ⏳ Time Elapsed      : ${(`${elapsedSec}s / ${durationSec}s [${bar}] ${percent}%`).padEnd(35)} │`;
    const line4 = `│ 👥 Virtual Users     : ${(vus + " Active VUs").padEnd(35)} │`;

    // Move cursor up 5 lines and rewrite lines in place without scrolling
    process.stdout.write("\x1b[5A\r");
    process.stdout.write(line1 + "\n\r");
    process.stdout.write(line2 + "\n\r");
    process.stdout.write(line3 + "\n\r");
    process.stdout.write(line4 + "\n\r");
    process.stdout.write("└────────────────────────────────────────────────────────────┘\n\r");
  };

  const timer = setInterval(() => {
    if (!isCapturingSummary) {
      updateDashboard(completedRequests);
    }
  }, 250);

  const hasLocalK6 = await checkK6Installed();
  const rootDir = process.cwd();
  const scriptPath = path.join(rootDir, "bench", "load.js");

  let proc;
  if (hasLocalK6) {
    const args = [
      "run",
      "--vus",
      vus.toString(),
      "--duration",
      `${durationSec}s`,
      "-e",
      `ENDPOINT=${endpoint}`,
      "-e",
      "TARGET_URL=http://localhost:3000",
      scriptPath,
    ];
    proc = spawn("k6", args);
  } else {
    const hasDocker = await checkDockerInstalled();
    if (!hasDocker) {
      clearInterval(timer);
      console.error("\n❌ Neither k6 nor Docker was found.");
      process.exit(1);
    }
    const args = [
      "run",
      "--rm",
      "-i",
      "--add-host=host.docker.internal:host-gateway",
      "-e",
      `ENDPOINT=${endpoint}`,
      "-e",
      "TARGET_URL=http://host.docker.internal:3000",
      "-v",
      `${path.join(rootDir, "bench").replace(/\\/g, "/")}:/bench`,
      "grafana/k6",
      "run",
      "--vus",
      vus.toString(),
      "--duration",
      `${durationSec}s`,
      "/bench/load.js",
    ];
    proc = spawn("docker", args);
  }

  const handleStreamData = (chunk: Buffer) => {
    const text = chunk.toString();

    // Check for iteration counts from k6 progress: e.g. "28484 complete"
    const match = text.match(/(\d+)\s+complete/);
    if (match) {
      const parsed = parseInt(match[1], 10);
      if (parsed > completedRequests) {
        completedRequests = parsed;
        updateDashboard(completedRequests);
      }
    }

    // Check when k6 reaches final summary table
    if (text.includes("THRESHOLDS") || text.includes("TOTAL RESULTS") || text.includes("checks_total")) {
      isCapturingSummary = true;
    }

    if (isCapturingSummary) {
      finalSummary += text;
    }
  };

  proc.stdout.on("data", handleStreamData);
  proc.stderr.on("data", handleStreamData);

  proc.on("exit", (code) => {
    clearInterval(timer);
    // Final in-place update
    updateDashboard(completedRequests);
    console.log("\n" + "=".repeat(62));
    console.log("   FINAL BENCHMARK REPORT");
    console.log("=".repeat(62) + "\n");

    if (finalSummary.trim()) {
      console.log(finalSummary.trim());
    } else {
      console.log(`Test completed with exit code: ${code}`);
    }
    process.exit(code || 0);
  });
}

main().catch((err) => {
  console.error("Runner error:", err);
  process.exit(1);
});
