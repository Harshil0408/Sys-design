# AI Agent Guidelines

Central instructions, guardrails, and blunder prevention for all AI agents.

## Rules Directory

| Rule File                                                                                | Topic                                                                       |
| ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| [.agents/rules/guardrails.md](file:///d:/sys-design/.agents/rules/guardrails.md)         | Blunder prevention & 9 critical guardrails                                  |
| [.agents/rules/response-style.md](file:///d:/sys-design/.agents/rules/response-style.md) | Chat style (Gujarati + English mix, crisp, no em-dashes)                    |
| [.agents/rules/repo.md](file:///d:/sys-design/.agents/rules/repo.md)                     | English-only repo, structure (`/docs`, `/case-studies`, `/implementations`) |
| [.agents/rules/safety.md](file:///d:/sys-design/.agents/rules/safety.md)                 | Safety summary table                                                        |

## Enforced Guardrails
1. **Approval Gate**: Wait for "okay" or "go" before execution in any mode.
2. **Zero Git**: Git operations reserved for user only.
3. **Database Protection**: No drops, deletes, or direct DB mutations.
4. **Zero File Deletion**: No deleting files or folders.
5. **Network Lockdown**: Block outbound external calls (`curl`, `wget`, `ssh`).
6. **Package Lockdown**: No unapproved or global installs.
7. **Secrets Protection**: Block `.env` and credential exposure.
8. **Workspace Boundary**: Stay strictly inside project root.
9. **System Protection**: No privilege escalation or process termination.
