# Editorial Roadmap: Personal AI Infrastructure

## Goal

Keep the blog focused on one durable theme:

> Build personal AI infrastructure that turns research, deployment, automation, and writing into reusable systems.

The blog should not become a pile of small tutorials. New notes should either become a pillar article, expand an existing pillar, or serve as a tightly scoped case study that links back to a pillar.

## Publishing Rules

1. Prefer 8-12 pillar notes over 30 small notes.
2. Do not publish a standalone note if the idea fits as a section in an existing pillar.
3. Merge overlapping notes by preserving the strongest title and moving the rest into sections.
4. Public notes must use example domains, variables, and public-safe IDs.
5. Each note must answer one core question.
6. Every note should contain a reproducible workflow, common failure modes, and a final checklist.
7. Never publish raw capture directly. Every note needs one editorial pass for focus and overlap, then one technical pass for privacy, commands, links, validation, commit, push, and deployment status.

## Quality Bar

Every published note must pass these checks before commit, push, or deployment:

1. **Single core question:** the reader should know exactly what problem the note solves from the title, description, and summary.
2. **Concrete workflow:** the body must include commands, schemas, configuration, API calls, or decision steps that a reader can reuse.
3. **No filler:** remove generic background that does not help the reader reproduce the work or make a better decision.
4. **No duplicate article:** if 70% of the value already exists in another note, update that note instead of publishing a new one.
5. **Public-safe examples:** no real API keys, private domains, project IDs, flow IDs, IP addresses, subscription links, or account identifiers.
6. **Failure modes:** include realistic symptoms, root causes, and fixes.
7. **Validation path:** include a command, checklist, or observable result that proves the workflow works.
8. **Source of truth:** when the note is based on actual work, cite the local artifact, command pattern, or flow shape that informed it.
9. **Editorial density:** prefer fewer stronger sections over many shallow sections.
10. **Link discipline:** link to related notes instead of repeating the same explanation.

If a draft fails any of these checks, either revise it or fold it into an existing pillar note.

## Article Review Checklist

Use this checklist before publishing each note:

- [ ] The title is specific and not generic.
- [ ] The description is a real one-sentence summary.
- [ ] The note has one clear target reader.
- [ ] The workflow can be followed without guessing missing context.
- [ ] Commands and code blocks have language tags.
- [ ] Sensitive values are replaced with variables or example domains.
- [ ] Existing related notes were checked for overlap.
- [ ] Repeated material is linked, not copied.
- [ ] Failure modes are specific enough to debug from.
- [ ] Final checklist proves the reader reached the goal.
- [ ] The draft has had an editorial pass for structure, density, and duplicate material.
- [ ] The draft has had a technical pass for commands, examples, links, and observable validation.
- [ ] Mintlify validation passes.
- [ ] `git diff --check` passes.

## Topic Architecture

### 1. LangFlow Systems

Purpose: Explain how LangFlow becomes an automation platform, not just a visual canvas.

Pillar notes:

- `Generate a Whole Book With LangFlow`
- `Deploy LangFlow On A VPS And Build Flows Through MCP`
- `Operate LangFlow Flows Through API And MCP`
- `LangFlow Debugging Playbook`

Merge or avoid duplicating:

- Long-flow operation details should live inside the API/MCP or debugging pillar.
- Subflow design should become a section inside the whole-book pillar unless it grows into a full architecture note.
- Red boxes, build streams, and `database is locked` belong in the debugging playbook.

### 2. Search And Research Agents

Purpose: Turn the Perplexity/Search/RAG work into one coherent research-agent series.

Pillar notes:

- `Recreate Perplexity Search With LangFlow`
- `Deep Research Is An Orchestration Loop`
- `Crawler Reads URLs, Search Finds URLs`
- `Source Maps, Chunk Citations, And Citation Validation`

Merge or avoid duplicating:

- SearXNG, Firecrawl, Exa, and Onyx comparisons should live inside the crawler/search pillar.
- Domain filters, reranking, and provider capability mapping should live inside the Perplexity pillar unless they need full implementation detail.
- Perplexity-computer style interaction should link back to the research-agent pillar rather than duplicate the search pipeline.

### 3. Self-Hosted AI Infrastructure

Purpose: Explain the server, DNS, HTTPS, and deployment layer behind the AI stack.

Pillar notes:

- `Self-Hosted AI Stack On A VPS`
- `Cloudflare DNS And HTTPS For Personal Services`
- `Deploy Websites To Vercel With Preview And Production`
- `Public Tutorial Privacy And Secret Hygiene`

Merge or avoid duplicating:

- Cloudflare IP DNS, Caddy reverse proxy, and grey-cloud/orange-cloud behavior should become one DNS/HTTPS pillar.
- Vercel custom domains, preview, production, and Git deploys should stay in one Vercel pillar.
- VPN/X-UI should be a case study under self-hosted services, not the main identity of the blog.

### 4. Codex As Workflow Engine

Purpose: Show how Codex becomes a long-running writing, debugging, and publishing assistant.

Pillar notes:

- `Use Codex Goal For Long Tasks`
- `Use Takenotes To Turn Debugging Into Blog Posts`
- `Safe Git Collaboration With An AI Agent`
- `Build Codex Skills For Repeatable Workflows`

Merge or avoid duplicating:

- Draft-review-publish flow belongs in the takenotes pillar.
- Dirty worktree handling belongs in the safe Git pillar.
- Skill creation and skill usage should be separate only if both are substantial.

## Current Notes Audit

Public navigation is organized into four theme groups:

- Self-Hosted AI Infrastructure
- LangFlow Systems
- Search And Research Agents
- Codex As Workflow Engine

Keep as pillars or case studies:

- `2026-06-02-generate-a-whole-book-with-langflow`
- `2026-06-02-deploy-langflow-on-a-vps-and-build-flows-through-mcp`
- `2026-06-02-operate-langflow-flows-through-api-and-mcp`
- `2026-06-02-langflow-debugging-playbook`
- `2026-06-02-recreate-perplexity-search-with-langflow`
- `2026-06-02-deep-research-is-an-orchestration-loop`
- `2026-06-02-crawler-reads-urls-search-finds-urls`
- `2026-06-02-source-maps-chunk-citations-and-citation-validation`
- `2026-06-02-codex-goal`
- `2026-06-02-takenotes`
- `2026-06-02-safe-git-collaboration-with-an-ai-agent`
- `2026-06-02-build-codex-skills-for-repeatable-workflows`
- `2026-06-02-vercel`
- `2026-06-02-cloudflare-ip-dns`
- `2026-06-01-deploy-x-ui-with-caddy-https-on-a-vps` as a self-hosted case study
- `2026-06-02-how-to-use-and-recreate-mintlify` as a publishing/tooling case study
- `2026-06-02-how-to-recreate-perplexity-computer-in-langflow` as a Computer-like runtime case study
- `2026-06-02-browseros-mcp` as a browser automation case study

Visible archive material:

- `2026-05-31-build-a-perplexity-like-web-search-flow-in-langflow`
- `2026-05-31-using-the-perplexity-like-langflow-search-flows`
- `2026-05-31-operate-langflow-long-flow-from-localhost-and-remote-apis`
- `2026-05-31-operate-langflow-flows-through-api-and-mcp`
- `2026-05-31-defer-streaming-and-keep-langflow-focused-on-evidence-flows`

These May notes are visible under `May` so older work can still be found and referenced. Treat them as raw historical material, not the canonical public-facing versions. The June notes remain the cleaner theme-organized articles. Avoid adding more Perplexity or LangFlow API notes unless they introduce a genuinely new system boundary.

LangFlow API/MCP overlap status:

- `2026-05-31-operate-langflow-long-flow-from-localhost-and-remote-apis` has been folded into `2026-06-02-operate-langflow-flows-through-api-and-mcp` as the local long-flow operations section.
- `2026-05-31-operate-langflow-flows-through-api-and-mcp` has been folded into `2026-06-02-operate-langflow-flows-through-api-and-mcp` as the canonical REST/MCP operations guide.

Perplexity/Search overlap status:

- `2026-05-31-build-a-perplexity-like-web-search-flow-in-langflow` has been folded into `2026-06-02-recreate-perplexity-search-with-langflow` as the architecture, API surfaces, crawler, filter, and citation sections.
- `2026-05-31-using-the-perplexity-like-langflow-search-flows` has been folded into `2026-06-02-recreate-perplexity-search-with-langflow` as the replication scorecard and expanded evaluation prompts.
- `2026-05-31-defer-streaming-and-keep-langflow-focused-on-evidence-flows` is treated as an archived decision note; the current public roadmap keeps streaming as future facade work inside `2026-06-02-recreate-perplexity-search-with-langflow`.

## Next Writing Order

1. Create new notes only after the existing overlap has been resolved.
2. If adding more Computer-like agent content, update `How To Recreate Perplexity Computer In Langflow` as the case study instead of starting another Perplexity Computer article.

## Immediate Quality Pass

Current target: hold the current architecture and avoid new overlapping notes.

Why this is next:

- `Operate LangFlow Flows Through API And MCP` now exists as the canonical API/MCP operations pillar.
- `Recreate Perplexity Search With LangFlow` now carries the remaining useful May Perplexity material.
- `Perplexity Computer` stays standalone as a Computer-like runtime case study, with links back to the search, Deep Research, and BrowserOS pillars.

Quality pass requirements:

1. New work should strengthen an existing pillar or case study unless it introduces a genuinely new system boundary.
2. Keep search pipeline detail in `Recreate Perplexity Search With LangFlow`.
3. Keep research-loop detail in `Deep Research Is An Orchestration Loop`.
4. Keep browser automation setup in `BrowserOS MCP`.
5. Keep Computer-like runtime design in `How To Recreate Perplexity Computer In Langflow`.
6. Remove real domains, local paths, flow IDs, project IDs, API keys, and provider keys before publishing changes.

## Decision Rule For Future Notes

Before writing a new note, ask:

1. Is this a pillar, a case study, or a section?
2. Which existing note would this duplicate?
3. What should be linked instead of repeated?
4. What secret or personal identifier must be removed?
5. What command, workflow, or checklist proves the note is useful?

If the answer is "section", update the existing pillar instead of creating a new note.
