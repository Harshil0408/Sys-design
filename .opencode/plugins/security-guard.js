// OpenCode Security & Guardrail Interceptor Plugin

export const SecurityGuard = async ({ client }) => {
  return {
    "tool.execute.before": async (input, output) => {
      const tool = (input && input.tool) ? String(input.tool).toLowerCase() : "";
      const args = (output && output.args) ? output.args : {};

      // 1. Block file read/edit on protected secrets
      if (tool === "read" || tool === "edit" || tool === "write") {
        const filePath = String(args.filePath || args.path || "").toLowerCase();
        if (filePath.includes(".env") || filePath.includes("id_rsa") || filePath.includes(".ssh")) {
          throw new Error("BLOCKED: Access to secrets and .env files is strictly prohibited.");
        }
      }

      // 2. Block tool-level delete
      if (tool === "delete" || tool === "delete_file" || tool === "remove") {
        throw new Error("BLOCKED: File deletions are strictly prohibited.");
      }

      // 3. Inspect bash / shell commands
      if (tool === "bash" || tool === "command" || tool === "terminal") {
        const rawCmd = String(args.command || args.cmd || "");
        const lower = rawCmd.toLowerCase();

        // 3a. Database Deletions & Drops
        if (/delete\s+from|deletemany|deleteone|drop\s+(table|database|schema|collection|index)|\.drop\(|\.remove\(|truncate\s+table|flushall|flushdb/i.test(lower)) {
          throw new Error("BLOCKED: Database deletion and drop operations are strictly prohibited.");
        }

        // 3b. Git Restrictions
        if (/\bgit\s+(commit|push|add|rm|reset|restore|rebase|merge|clean|checkout\s+-[bfm]|tag|branch\s+-[dd])\b/i.test(lower)) {
          throw new Error("BLOCKED: Mutating git commands (commit, push, add, etc.) are user-only.");
        }
        if (/\bgit\b/i.test(lower) && !/\bgit\s+(status|log|diff)\b/i.test(lower)) {
          throw new Error("BLOCKED: Git operations are prohibited for agents. Only user runs git.");
        }

        // 3c. File Deletions
        if (/\b(rm|rmdir|unlink|del|remove-item|erase|ri|rimraf|shred)\b/i.test(lower)) {
          throw new Error("BLOCKED: File deletions are strictly prohibited.");
        }

        // 3d. External Network Calls
        if (/\b(curl|wget|invokewebrequest|invokerestmethod|iwr|irm|ssh|scp|ftp|nc|ncat)\b/i.test(lower)) {
          throw new Error("BLOCKED: Outbound network calls are prohibited.");
        }

        // 3e. Process Termination
        if (/\b(kill|pkill|killall|taskkill|stop-process)\b/i.test(lower)) {
          throw new Error("BLOCKED: Process termination is prohibited without approval.");
        }

        // 3f. Secrets & .env Access
        if (/(\.env|id_rsa|\.aws|\.ssh)/i.test(lower)) {
          throw new Error("BLOCKED: Reading or modifying .env or credentials is prohibited.");
        }

        // 3g. Privilege Escalation
        if (/\b(sudo|su|runas|start-process\s+.*-verb\s+runas|chmod\s+777)\b/i.test(lower)) {
          throw new Error("BLOCKED: Privilege escalation commands are prohibited.");
        }

        // 3h. Workspace Boundary Escape
        if (/(\.\.[\\/]\.\.|cd\s+[a-z]:\\|set-location\s+[a-z]:\\)/i.test(lower)) {
          throw new Error("BLOCKED: Boundary escape outside repository is prohibited.");
        }
      }
    }
  };
};

export default SecurityGuard;
