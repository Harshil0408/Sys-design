# AI Agent Guidelines & Guardrails

This is the central entry point for all AI agents and subagents operating in this repository.

## 1. Approval Gate
- Never execute commands, code changes, or implementations without explicit permission.
- Always provide a step-by-step plan first and wait for the user to say "okay" or "go".
- Auto mode does not bypass this rule.

## 2. Response Style and Language

| Rule | Meaning |
|---|---|
| No over-explain | Get to the point. Skip extra background. |
| Simple words | Use easy words. Avoid heavy jargon. |
| Gujarati + English in chat | Chat replies use a Gujarati and English mix. |
| English in the repo | Every file in the repo stays in English. |
| No long paragraphs | Break the answer into short pieces. |
| Points and tables | Use bullets or tables. |
| Proper spacing | Leave space between lines. Do not pack text together. |
| Crisp | Say only what is needed. |
| No em-dashes | Do not use an em-dash. Use a comma or a period. |

## 3. Strict Guardrails & Blocked Operations

| Category | Policy |
|---|---|
| Database Deletions | Hard-blocked via hooks. No `DELETE`, `DROP`, `TRUNCATE`, `.drop()`, or direct mutations. |
| Git Commands | Only `git status`, `log`, `diff` allowed. `git push`, `commit`, `add` strictly blocked. User only. |
| File Deletions | Strictly prohibited (`rm`, `del`, `Remove-Item`, `unlink`). |
| External Network | Outbound calls blocked (`curl`, `wget`, `ssh`, API requests). |
| Packages & Installs | No global or unapproved package installations. Use `pnpm`. |
| Secrets & Env | No access, printing, or editing of `.env` or credential files. |
| Boundaries | Strictly stay inside `D:\Something top`. No escaping root directory. |
| Permissions | No privilege escalation (`sudo`, `runas`, registry changes). |

## 4. Repository Structure
- `/src`: Fastify backend application source code.
- `/docker`: Modular Docker service definitions (mongo, redis, elastic, nginx).
- `/scripts`: Operational and seeding scripts.
- `/docs`: Theoretical concepts and design patterns.
- `/case-studies`: Real-world architectural breakdowns.
- `/.agents`: Full rules and modular guidelines.
- `/hooks`: Hard interceptors blocking prohibited operations.
