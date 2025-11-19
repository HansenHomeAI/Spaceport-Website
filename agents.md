# Repository Guidelines

## Agentic Dev Loop SOP
1. **Branch**: from whichever branch you're currently tasked to extend (often `development`, but honor any provided base) create `agent-12345678-task-name` (unique eight-digit ID plus slug, e.g. `agent-74120953-update-web-copy`).
2. **Baseline**: push your task branch to trigger the Cloudflare Pages workflow, then monitor *every* GitHub Actions run kicked off by the push until they finish successfully (use `gh run list --branch <branch>` to enumerate, and `gh run watch <id> --exit-status` on each run). At minimum, confirm both the Pages deploy and the "CDK Deploy" workflow are green before moving on, capturing failing logs immediately if either stops early.
 - Push the branch upstream as soon as there is meaningful work (`git push origin agent-…`) so deploy workflows and reviewers can see your changes.
 - If a deployment is rejected, immediately check environment protection rules: `gh api repos/$OWNER/$REPO/environments/<env>/deployment-branch-policies` and adjust with `gh api ... --field name="agent-*" --field type="branch"` (or coordinate with the maintainer) before retrying. The same expectation applies to infrastructure runs—never continue while "CDK Deploy" is red.
 - When validating UI or MCP flows, always use the Cloudflare preview alias produced by your branch deployment—avoid hitting production until the preview passes.
  - Stay in the loop: keep iterating (push → deploy → validate → fix) without pausing for maintainer approval unless you are blocked by secrets or protections.
3. **Test**: start Playwright MCP with `python3 scripts/playwright-mcp-manager.py ensure`, record a baseline run, and expand coverage when gaps appear.
4. **Iterate**: apply the smallest fix, redeploy, watch the live preview build/logs, and rerun the baseline until everything passes.
5. **Wrap**: open a `development` PR only after preview and tests are green; escalate secret or production-config work.

## Autonomy Contract (Do Not Pause)
- You are a continuous worker. After every action, immediately choose and execute the next action without asking for approval.
- Only stop if BLOCKED by one of: (1) missing or invalid secrets or permissions, (2) environment protections you cannot alter, (3) an irreversible destructive change that violates Guardrails, (4) an instruction conflict you cannot safely resolve.
- If BLOCKED, write `STATE.md` with `reason`, `last_step`, `next_unblocked_step`, and exact `owner_action_needed`, then stop.

## Watchdog Usage (Required)
- Run the autonomy watchdog whenever you want continuous iteration:
```bash
tmux new -s codex 'scripts/codex-loop.sh'
```

## Checkpoints & Self-Resume
- Maintain `STATE.md` at repo root. On start, if it exists, read it and resume from `next_unblocked_step`.
- After each loop (push → deploy → validate → fix), append a terse line to `logs/agent-loop.log`: `[timestamp] step -> outcome -> next`.
- Always bump `web/trigger-dev-build.txt` when you need a Pages build.
- Prefer silent iteration: store long logs under `logs/` and link paths in commits.

## Output Budget
- Keep messages ≤ 120 lines. Do not paste full CI or browser logs inline—save to `logs/` and summarize in ≤ 10 lines.
- Set model verbosity to minimal; do not produce progress essays.

## Deployment & URL Discovery (No Guesswork)
- Never hit production until preview is green.
- After push, resolve the exact preview URL deterministically:
  1) `gh run watch --workflow deploy-cloudflare-pages.yml --branch <branch> --exit-status`
  2) Query run outputs or derive Pages alias from `$BRANCH` and print: `PREVIEW_URL=<resolved-url>`
- Use that `PREVIEW_URL` in Playwright MCP; fail the loop if it is missing.

## Guardrails (Never Do)
- Modify `main` or production configuration.
- Change secrets or add deploy targets.
  - If a secret needs to change, document the exact key/value and pause for maintainer approval—do not edit secrets yourself.
- Disable tests or drop coverage to "make it pass".
- Commit binaries larger than 5 MB.
- **Never build containers locally.** If there is an edit to the containers, Containers are built automatically by GitHub Actions on push. We never build on our local machine.

## Project Structure & Module Organization
`web/` holds the Next.js App Router (`app/`), shared `components/`, helpers in `lib/`, and static `public/`. `infrastructure/` covers CDK stacks, Lambda code, and container contexts; `scripts/` hosts automation; `tests/` contains regression suites.

## Build, Test, and Development Commands
Inside `web/`: run `npm install`, `npm run dev`, `npm run build`, `npm run start`, and `npm run cf:build`/`npm run cf:preview` for Cloudflare builds. For CDK use `pip install -r infrastructure/spaceport_cdk/requirements.txt` followed by `cdk synth` or `cdk deploy`. Environment tip: surface `NEXT_PUBLIC_FEEDBACK_API_URL` (Feedback API output) alongside the existing public API URLs, and verify branch-specific `NEXT_PUBLIC_*` secrets with `gh secret list --repo …` instead of hardcoding fallbacks.

## Coding Style & Naming Conventions
Frontend: TypeScript, two-space indent, PascalCase components, camelCase utilities, `npx next lint` before committing, and keep server/client modules split. Infrastructure Python follows PEP 8 (snake_case, docstrings).

## Testing Guidelines
Run `python3 tests/run_beta_readiness_suite.py` for full regression (`--quick` for faster loops); targeted work should call the scripts in `tests/pipeline/`. For MCP frontend coverage ensure Node 18+ and run `npx playwright install` once, start the server with `python3 scripts/playwright-mcp-manager.py ensure` (honours `PLAYWRIGHT_MCP_PORT`/`PLAYWRIGHT_MCP_COMMAND`) or launch `npx @playwright/mcp@latest --headless`. After `browser_navigate`, read the YAML snapshot for refs (e.g. `textbox "Email" [ref=e35]`) before driving `browser_fill_form`, `browser_click`, `browser_wait_for`, or `browser_handle_dialog`, and log arguments plus console output each step. Use `npx @wong2/mcp-cli npx @playwright/mcp@latest` for STDIO probes or script the SSE endpoint with `@modelcontextprotocol/sdk`—`scripts/run_waitlist_flow.mjs` is a template that can be retargeted via its URL argument or `PLAYWRIGHT_MCP_SSE_URL`. For front-end tweaks, always bump `web/trigger-dev-build.txt` (canonical Cloudflare trigger) unless you explicitly re-run the Pages workflow via `gh workflow run .github/workflows/deploy-cloudflare-pages.yml --ref <branch>`. Supplement MCP telemetry with the local CLIs you already have (`gh`, `aws`, `wrangler`, `git`, etc.) before falling back to raw APIs.

## Commit & Pull Request Guidelines
Stick to the Conventional Commit prefixes in history (`feat:`, `fix:`, `chore:`). PRs target `development`, reference the driving task, describe behavior changes, detail exercised tests (Playwright MCP, beta readiness, manual), share screenshots or logs for UI updates, and wait for the preview to stabilize before review.
