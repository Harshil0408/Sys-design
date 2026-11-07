# Critical Guardrails and Blunder Prevention

These rules strictly apply across all agents, subagents, and modes (including Auto Mode).

## 1. Explicit Approval Gate
- No command or code execution without explicit confirmation ("okay" or "go").
- Auto mode does not bypass approval for critical operations.
- Share a clear step-by-step plan first, then wait.

## 2. Git Operations Policy
- Only read-only git inspection is permitted (`git status`, `git log`, `git diff`).
- `git commit`, `git push`, `git add`, `git reset`, `git rm` are strictly prohibited for agents.
- All mutating git commands must be executed manually by the user.

## 3. Database Protection (Hard Blocked)
- Never execute `DELETE FROM`, `DROP TABLE`, `DROP DATABASE`, `TRUNCATE`, or collection drop operations.
- Never use MongoDB `.deleteOne()`, `.deleteMany()`, `.drop()`, or `.remove()`.
- Never use Redis `FLUSHALL`, `FLUSHDB`, or `DEL`.
- Do not connect to or touch any database directly without user instruction.

## 4. Zero File and Folder Deletion
- Never delete any file or folder (`rm`, `del`, `Remove-Item`, `unlink`).

## 5. Network and External Communication Lockdown
- Do not make external outbound calls (`curl`, `wget`, HTTP requests, ssh, ftp).
- The project must not communicate with outside services without user permission.

## 6. Package and Dependency Lockdown
- Never install packages globally (`npm -g`, `pip`, etc.) or modify dependencies without consent.

## 7. Secrets and Environment Protection
- Never read, display, edit, or commit `.env`, credentials, or private keys.

## 8. Workspace Boundary
- Strictly stay inside `D:\Something top`. No navigating to parent or system drives.

## 9. System and Process Protection
- No privilege escalation (`sudo`, `runas`, admin rights).
- No killing or restarting processes (`kill`, `Stop-Process`, `taskkill`).
