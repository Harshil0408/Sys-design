# Safety Guardrails

See [guardrails.md](file:///D:/Something%20top/.agents/rules/guardrails.md) for full details.

| Category     | Constraint                                      | Enforcement                |
| ------------ | ----------------------------------------------- | -------------------------- |
| Execution    | No command execution without explicit approval  | Ask first                  |
| Git / GitHub | No git commands (`add`, `commit`, `push`, etc.) | User only                  |
| Database     | No deletes, drops, or direct DB mutations       | Strictly prohibited        |
| Filesystem   | Zero deletions of any file or folder            | Strictly prohibited        |
| Scope        | Stay strictly inside `D:\Something top`         | No parent directory access |
| Creation     | Plan must be approved before creating any files | Wait for "go"              |
