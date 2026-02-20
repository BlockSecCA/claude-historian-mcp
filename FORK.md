# Fork: Scan Limits, Scoring Bias, and Garbled Output Fixes

This is a fork of [Vvkmnn/claude-historian-mcp](https://github.com/Vvkmnn/claude-historian-mcp) with fixes for three structural problems that made the tool unreliable for non-JS-framework use cases (security domain, conceptual work, multi-workspace setups).

## What was wrong

### 1. Hardcoded scan limits

The search functions had low hardcoded caps on how many projects and files they'd scan:

| Function | Projects (before → after) | Files/project (before → after) |
|----------|--------------------------|-------------------------------|
| `searchConversations` | 8 → 30 | 4 → 15 |
| `getRecentSessions` | 10 → 30 | 5 → 15 |
| `findSimilarQueries` | 8 → 30 | 5 → 15 |
| `getErrorSolutions` | 12 → 30 | 6 → 15 |
| `getToolPatterns` | 15 → 30 | 8 → 15 |
| `findFileContext` | 15 → 30 | 10 → 15 |

If you had more than ~10 projects, most of your history was invisible. Limits are now configurable constants in `scoring-constants.ts`.

### 2. Tech-biased scoring

The scoring system was designed for JS/web developers. Two mechanisms caused problems:

**`CORE_TECH_PATTERN`** — a regex matching ~50 framework names (webpack, react, docker, etc.). If your query contained one of these, the content *had* to contain it too or the result was rejected with a score of -1000. Any query that didn't contain a recognized tech name got no benefit from this system.

**`GENERIC_TERMS`** — a 200-word blocklist of terms that were never scored, including: `domain`, `architecture`, `pattern`, `model`, `design`, `component`, `schema`, `interface`, `strategy`, `implementation`, `system`, `service`, `testing`, `performance`, `cache`, `database`, `deployment`, and many more. These are generic in a JS tutorial context but are primary search terms in security, architecture, and domain modeling work.

**Fix:** Deleted `CORE_TECH_PATTERN` entirely. Replaced `GENERIC_TERMS` with a ~30-word `STOP_WORDS` set of actual natural-language filler (`the`, `and`, `for`, `with`, etc.). All query terms are now scored equally. Removed tech-specific semantic boosts (`error→3.0`, `implement→2.5`, `fix→2.8`).

### 3. Garbled content output

**Sentence reordering** — `extractMostValuableContent()` split content into sentences, scored each one by keyword density, sorted by score, and reassembled. This destroyed the reading order of conversational content, producing output where conclusions appeared before premises and context was lost.

**Fix:** Sequential truncation. Content is kept from the beginning and cut at the nearest natural boundary (paragraph, sentence, word) before the length limit. Only structured content (code blocks, error messages) uses the extractive approach.

**Action item truncation** — bullet point extraction used `/[-*]\s+([^\n.]{15,150})/g` which would cut at exactly 150 characters regardless of word boundaries, producing items like `"Add configurable scan limit constants (30 projects, 15 files) replacing hardcoded limits that missed most conversa"`.

**Fix:** Changed capture to `[^\n]{15,150}` (don't break on periods within bullets) and added word-boundary backtracking when the capture hits the 150-char limit.

**Greedy accomplishment matching** — the pattern `/(completed|implemented|fixed|created|built|added):?\s*([^.\n]{10,80})/i` matched mid-sentence in unrelated text because it didn't require a sentence or line boundary.

**Fix:** Added `(?:^|\n)\s*` anchor so the pattern only fires at the start of a line.

## Install from this fork

```bash
# Remove original
claude mcp remove claude-historian-mcp

# Install from fork
claude mcp add claude-historian-mcp -- npx github:BlockSecCA/claude-historian-mcp

# Or clone locally (faster cold start)
git clone https://github.com/BlockSecCA/claude-historian-mcp.git
cd claude-historian-mcp && npm install && npm run build
claude mcp add claude-historian-mcp -- node /absolute/path/to/dist/index.js
```
