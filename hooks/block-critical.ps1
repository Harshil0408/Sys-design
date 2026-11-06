# Windows PowerShell Pre-Tool-Use Interceptor
param (
    [string]$Command
)

$RootDir = Split-Path -Parent $PSScriptRoot
$LogFile = Join-Path $RootDir "hooks\denied.log"

function Deny-Action {
    param([string]$Reason)
    $timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
    Add-Content -Path $LogFile -Value "$timestamp $Reason" -ErrorAction SilentlyContinue
    $resp = @{
        permission = "deny"
        user_message = "Blocked by security hook: $Reason"
        agent_message = "BLOCKED: $Reason. This action is restricted."
    } | ConvertTo-Json -Compress
    [Console]::WriteLine($resp)
    exit 2
}

function Allow-Action {
    $resp = @{ permission = "allow" } | ConvertTo-Json -Compress
    [Console]::WriteLine($resp)
    exit 0
}

$CmdToCheck = $Command

# Only read stdin if command was not passed via argument and input is available
if ([string]::IsNullOrWhiteSpace($CmdToCheck)) {
    if ([Console]::IsInputRedirected) {
        $InputContent = [Console]::In.ReadToEnd()
        if (-not [string]::IsNullOrWhiteSpace($InputContent)) {
            try {
                $json = $InputContent | ConvertFrom-Json
                if ($json.tool_name -match "(?i)delete") {
                    Deny-Action "tool-delete-prohibited"
                }
                if ($json.command) {
                    $CmdToCheck = $json.command
                }
            } catch {
                $CmdToCheck = $InputContent
            }
        }
    }
}

if ([string]::IsNullOrWhiteSpace($CmdToCheck)) {
    Allow-Action
}

$lower = $CmdToCheck.ToLower()

# 1. DATABASE DELETIONS & DROPS
if ($lower -match "(delete\s+from|deletemany|deleteone|drop\s+(table|database|schema|collection|index)|\.drop\(|\.remove\(|truncate\s+table|flushall|flushdb)") {
    Deny-Action "database-deletion-prohibited"
}

# 2. GIT RESTRICTIONS
# Strictly block commit, push, add, rm, reset, restore, merge, rebase, clean
if ($lower -match "\bgit\s+(commit|push|add|rm|reset|restore|rebase|merge|clean|checkout\s+-[bfm]|tag|branch\s+-[dd])\b") {
    Deny-Action "git-mutating-command-prohibited"
}
# Disallow all git commands except read-only inspection (status, log, diff)
if ($lower -match "\bgit\b" -and ($lower -notmatch "\bgit\s+(status|log|diff)\b")) {
    Deny-Action "git-command-blocked-user-only"
}

# 3. FILE DELETIONS
if ($lower -match "\b(rm|rmdir|unlink|del|remove-item|erase|ri)\b") {
    Deny-Action "file-deletion-prohibited"
}
if ($lower -match "\b(rimraf|shred)\b") {
    Deny-Action "destructive-fs-operation"
}

# 4. EXTERNAL NETWORK CALLS
if ($lower -match "\b(curl|wget|invokewebrequest|invokerestmethod|iwr|irm|ssh|scp|ftp|nc|ncat)\b") {
    Deny-Action "outbound-network-call-prohibited"
}

# 5. PROCESS TERMINATION
if ($lower -match "\b(kill|pkill|killall|taskkill|stop-process)\b") {
    Deny-Action "process-termination-prohibited"
}

# 6. CREDENTIALS AND .ENV ACCESS
if ($lower -match "(\.env|id_rsa|\.aws|\.ssh)") {
    Deny-Action "credentials-access-prohibited"
}

# 7. PRIVILEGE ESCALATION
if ($lower -match "\b(runas|start-process\s+.*-verb\s+runas|reg\s+add|reg\s+delete)\b") {
    Deny-Action "privilege-escalation-prohibited"
}

Allow-Action
