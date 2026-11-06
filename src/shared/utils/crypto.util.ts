import { randomBytes, createHash } from "node:crypto";

export function generateBookingReference(): string {
  return "BMS-" + randomBytes(4).toString("hex").toUpperCase();
}

export function hashString(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}
