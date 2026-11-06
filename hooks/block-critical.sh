#!/usr/bin/env bash
# Claude and Multi-Agent Pre-Tool-Use Interceptor
set -u

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOG="$ROOT/hooks/denied.log"

deny() {
  local rule="$1"
  mkdir -p "$ROOT/hooks"
  printf '%s %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$rule" >> "$LOG"
  # Standard Claude PreToolUse JSON response
  printf '{"permission":"deny","user_message":"Blocked by security hook: %s","agent_message":"BLOCKED: %s. This action is restricted."}\n' "$rule" "$rule"
  exit 2
}

allow() {
  printf '{"permission":"allow"}\n'
  exit 0
}

json_string() {
  local key="$1"
  local blob="$2"
  printf '%s' "$blob" | sed -n "s/.*\"${key}\"[[:space:]]*:[[:space:]]*\"\\([^\"]*\\)\".*/\\1/p" | head -1
}

check_command() {
  local raw_cmd="$1"
  local lower
  lower="$(printf '%s' "$raw_cmd" | tr '[:upper:]' '[:lower:]')"

  # 1. DATABASE DELETIONS & DROPS
  if printf '%s' "$lower" | grep -Eq '(delete[[:space:]]+from|deletemany|deleteone|drop[[:space:]]+(table|database|schema|collection|index)|\.drop\(|\.remove\(|truncate[[:space:]]+table|flushall|flushdb)'; then
    deny "database-deletion-prohibited"
  fi

  # 2. GIT RESTRICTIONS
  # Strictly block commit, push, add, rm, reset, restore, merge, rebase, clean
  if printf '%s' "$lower" | grep -Eq '\bgit[[:space:]]+(commit|push|add|rm|reset|restore|rebase|merge|clean|checkout[[:space:]]+-[bfm]|tag|branch[[:space:]]+-[dD])\b'; then
    deny "git-mutating-command-prohibited"
  fi
  # Disallow all git commands except read-only inspection (status, log, diff)
  if printf '%s' "$lower" | grep -Eq '\bgit\b'; then
    if ! printf '%s' "$lower" | grep -Eq '\bgit[[:space:]]+(status|log|diff)\b'; then
      deny "git-command-blocked-user-only"
    fi
  fi

  # 3. FILE DELETIONS
  if printf '%s' "$lower" | grep -Eq '(^|[;&|([:space:]])(/bin/|/usr/bin/)?(rm|rmdir|unlink|del|remove-item|erase)\b'; then
    deny "file-deletion-prohibited"
  fi
  if printf '%s' "$lower" | grep -Eq '(rimraf|shred|mkfs|dd[[:space:]]+.*of=)'; then
    deny "destructive-fs-operation"
  fi

  # 4. EXTERNAL NETWORK CALLS
  if printf '%s' "$lower" | grep -Eq '\b(curl|wget|nc|ncat|ssh|scp|ftp|telnet)\b'; then
    deny "outbound-network-call-prohibited"
  fi

  # 5. PROCESS KILLING
  if printf '%s' "$lower" | grep -Eq '\b(kill|pkill|killall|taskkill|stop-process)\b'; then
    deny "process-termination-prohibited"
  fi

  # 6. CREDENTIALS AND .ENV ACCESS
  if printf '%s' "$lower" | grep -Eq '(\.env|id_rsa|\.aws|\.ssh)'; then
    deny "credentials-access-prohibited"
  fi

  # 7. PRIVILEGE ESCALATION
  if printf '%s' "$lower" | grep -Eq '\b(sudo|su|runas|chmod[[:space:]]+777)\b'; then
    deny "privilege-escalation-prohibited"
  fi
}

# Read stdin (Claude passes JSON payload to PreToolUse hooks)
input="$(cat 2>/dev/null || true)"

if [[ -n "${input//[[:space:]]/}" ]]; then
  tool="$(json_string tool_name "$input")"
  cmd="$(json_string command "$input")"
  file_path="$(json_string file_path "$input")"
  tool_lower="$(printf '%s' "$tool" | tr '[:upper:]' '[:lower:]')"

  # Block any direct delete tool calls
  if [[ "$tool_lower" == "delete" || "$tool_lower" == "delete_file" ]]; then
    deny "tool-delete-prohibited"
  fi

  # Check command if present in JSON
  if [[ -n "$cmd" ]]; then
    check_command "$cmd"
  fi
fi

# Also check CLI arguments if passed directly (e.g. ./block-critical.sh "command")
if [[ $# -gt 0 ]]; then
  check_command "$*"
fi

allow
