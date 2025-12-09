# claude-historian

![claude-historian](demo.gif)

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server for searching your [Claude Code](https://docs.anthropic.com/en/docs/claude-code) (& [Claude Desktop](https://claude.ai/download)) conversation history. Find past solutions, track file changes, and learn from previous work.

[![npm version](https://img.shields.io/npm/v/claude-historian.svg)](https://www.npmjs.com/package/claude-historian)
[![npm downloads](https://img.shields.io/npm/dm/claude-historian.svg)](https://www.npmjs.com/package/claude-historian)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org/)
[![GitHub stars](https://img.shields.io/github/stars/Vvkmnn/claude-historian?style=social)](https://github.com/Vvkmnn/claude-historian)
![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/Vvkmnn/claude-historian?utm_source=oss&utm_medium=github&utm_campaign=Vvkmnn%2Fclaude-historian&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)
[![Claude](https://img.shields.io/badge/Claude-D97757?logo=claude&logoColor=fff)](#)

## install

Requirements:

- [Claude Code](https://claude.ai/code)

```bash
npm install -g claude-historian
```

**From shell:**

```bash
claude mcp add claude-historian -- npx claude-historian
```

**From inside Claude** (restart required):

```
Add this to our global mcp config: npx claude-historian

Install this mcp: https://github.com/Vvkmnn/claude-historian
```

**From any manually configurable `mcp.json`**: (Cursor, Windsurf, etc.)

```json
{
  "mcpServers": {
    "claude-historian": {
      "command": "npx",
      "args": ["claude-historian"],
      "env": {}
    }
  }
}
```

That's it; there is **no `npm install` required** as there are no external dependencies or local databases, only search algorithms.

However, in the unlikely event that you pull the wrong package / `npx` registry is out of date, you can force resolution issues in certain environments with:

```bash
npm install -g claude-historian
```

## features

[MCP server](https://modelcontextprotocol.io/) that gives Claude access to your conversation history. Fast search with smart prioritization.

Runs locally (with cool shades `[⌐■_■]`):

```
[⌐■_■] search_conversations query=<query>
  > "How did we fix that Redis connection pooling nightmare?"
  > "Docker container keeps crashing on Kubernetes deployment"
  > "React infinite re-render loop - useEffect dependency hell"

[⌐□_□] find_file_context filepath=<filepath>
  > "package.json changes that broke everything last month"
  > "When we accidentally committed .env to main branch"
  > "Authentication service refactor - before/after comparison"

[⌐×_×] get_error_solutions error_pattern=<error>
  > "MODULE_NOT_FOUND - the classic npm/yarn version mismatch"
  > "CORS preflight failing - but only on production Fridays?"
  > "Database deadlock during Black Friday traffic spike"

[⌐◆_◆] find_similar_queries query=<query>
  > "Database queries slower than my morning coffee brewing"
  > "How to implement error boundaries without losing sanity"
  > "State management: Redux vs Zustand vs just useState"

[⌐○_○] list_recent_sessions
  > "Tuesday debugging marathon: 9pm-3am flaky test hunt"
  > "Performance optimization sprint - reduced bundle 40%"
  > "The great TypeScript migration of 2024"

[⌐⎚_⎚] find_tool_patterns tool_name=<tool>
  > "Read → Edit → Bash combo for rapid prototyping"
  > "When I use Grep vs Task for different searches"
  > "Git operations during feature branch management"

[⌐◉_◉] extract_compact_summary session_id=<id>
  > "What did we accomplish in last session?"
  > "Summarize the authentication refactor work"
  > "Key decisions from yesterday's debugging"
```

<details>
<summary><b>output examples</b></summary>

```json
[⌐■_■] "docker auth" | 2 results

{
  "results": [{
    "type": "assistant",
    "ts": "2h ago",
    "content": "Fixed Docker auth by updating registry credentials...",
    "project": "my-app",
    "score": 15,
    "ctx": { "filesReferenced": ["docker-compose.yml"], "toolsUsed": ["Edit", "Bash"] }
  }]
}
```

```json
[⌐□_□] "package.json" | 5 operations

{
  "filepath": "package.json",
  "operations": [{
    "type": "edit",
    "ts": "1d ago",
    "changes": ["added vitest dependency", "updated build script"],
    "ctx": { "filesReferenced": ["package.json", "vitest.config.ts"] }
  }]
}
```

```json
[⌐×_×] "ENOENT no such file" | 2 solutions

{
  "solutions": [{
    "pattern": "ENOENT: no such file or directory",
    "frequency": 3,
    "fixes": [{ "content": "Created missing directory", "code": ["mkdir -p ./dist"] }]
  }]
}
```

```json
[⌐◆_◆] "typescript error handling" | 3 similar

{
  "similar": [{
    "query": "how to handle async errors in typescript",
    "similarity": 0.72,
    "ts": "3d ago",
    "project": "api-server"
  }]
}
```

```json
[⌐○_○] all | 3 sessions

{
  "sessions": [{
    "id": "68d5323b",
    "ts": "2h ago",
    "duration": 45,
    "messages": 128,
    "project": "my-app",
    "tools": ["Edit", "Bash", "Read"],
    "accomplishments": ["fixed auth bug", "added unit tests"]
  }]
}
```

```json
[⌐⎚_⎚] "Edit" | 3 patterns

{
  "tool": "Edit",
  "patterns": [{
    "name": "Read → Edit → Bash",
    "uses": 7,
    "workflow": "Read → Edit → Bash",
    "practice": "Read file, edit, then run tests (7x successful)"
  }]
}
```

```json
[⌐◉_◉] extracting summary from my-app (68d5323b)

{
  "session": {
    "id": "68d5323b",
    "ts": "2h ago",
    "duration": 45,
    "messages": 128,
    "project": "my-app",
    "tools": ["Edit", "Bash", "Read"],
    "files": ["src/auth.ts", "package.json"],
    "accomplishments": ["fixed auth bug", "added unit tests"],
    "decisions": ["chose JWT over sessions"]
  }
}
```

</details>

## methodology

How [claude-historian](https://github.com/Vvkmnn/claude-historian) [works](https://github.com/Vvkmnn/claude-historian/tree/master/src):

```
"docker auth" query
      |
      ├─> Parallel Processing (search.ts:157): 15 projects × 10 files concurrently
      |   • Promise.allSettled for 6x speed improvement
      |   • Early termination when sufficient results found
      |   • Enhanced file coverage with comprehensive patterns
      |
      ├─> Enhanced Classification (search.ts:582): implementation → boost tool workflows
      |   • Workflow detection for tool sequences (Edit → Read → Bash)
      |   • Semantic boundary preservation (never truncate mid-function)
      |   • Claude-optimized formatting with rich metadata
      |
      ├─> Smart Ranking (search.ts:637):
      |   • "Edit workflow (7x successful)" (2h ago) *****
      |   • "Docker auth with context paths" (yesterday) ****
      |   • "Container debugging patterns" (last week) ***
      |
      └─> Return Claude Code optimized results
```

**Core optimizations:**

- [parallel processing](https://github.com/Vvkmnn/claude-historian/blob/master/src/search.ts#L157): `Promise.allSettled` for 6x speed improvement across projects and files
- [workflow detection](https://github.com/Vvkmnn/claude-historian/blob/master/src/search.ts#L1010): Captures tool sequences like "Edit → Read → Bash" patterns
- [enhanced file matching](https://github.com/Vvkmnn/claude-historian/blob/master/src/search.ts#L694): Comprehensive path variations with case-insensitive matching
- [intelligent deduplication](https://github.com/Vvkmnn/claude-historian/blob/master/src/search-helpers.ts#L40): Content-based deduplication preserving highest-scoring results
- [intelligent truncation](https://github.com/Vvkmnn/claude-historian/blob/master/src/formatter.ts#L46): Never truncates mid-function or mid-error
- [Claude-optimized formatting](https://github.com/Vvkmnn/claude-historian/blob/master/src/formatter.ts#L15): Rich metadata with technical content prioritization

**Search strategies:**

- **[JSON streaming parser](https://en.wikipedia.org/wiki/JSON_streaming)** ([parseJsonlFile](https://github.com/Vvkmnn/claude-historian/blob/master/src/parser.ts#L16)): Reads Claude Code conversation files on-demand without full deserialization
- **[LRU caching](<https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)>)** ([messageCache](https://github.com/Vvkmnn/claude-historian/blob/master/src/search.ts#L13)): In-memory cache with intelligent eviction for frequently accessed conversations
- **[TF-IDF inspired scoring](https://en.wikipedia.org/wiki/Tf%E2%80%93idf)** ([calculateRelevanceScore](https://github.com/Vvkmnn/claude-historian/blob/master/src/search.ts#L637)): Term frequency scoring with document frequency weighting for relevance
- **[Query classification](https://en.wikipedia.org/wiki/Text_classification)** ([classifyQueryType](https://github.com/Vvkmnn/claude-historian/blob/master/src/search.ts#L582)): Naive Bayes-style classification (error/implementation/analysis/general) with adaptive limits
- **[Edit distance](https://en.wikipedia.org/wiki/Edit_distance)** ([calculateQuerySimilarity](https://github.com/Vvkmnn/claude-historian/blob/master/src/search-helpers.ts#L157)): Fuzzy matching for technical terms and typo tolerance
- **[Exponential time decay](https://en.wikipedia.org/wiki/Exponential_decay)** (getTimeRangeFilter): Recent messages weighted higher with configurable half-life
- **[Parallel file processing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)** ([getErrorSolutions](https://github.com/Vvkmnn/claude-historian/blob/master/src/search.ts#L882)): Concurrent project scanning with early termination for 0.8s response times
- **[Workflow pattern recognition](https://en.wikipedia.org/wiki/Sequential_pattern_mining)** ([getToolPatterns](https://github.com/Vvkmnn/claude-historian/blob/master/src/search.ts#L1010)): Detects tool usage sequences and related workflows for learning
- **[Enhanced file context](<https://en.wikipedia.org/wiki/Path_(computing)>)** ([findFileContext](https://github.com/Vvkmnn/claude-historian/blob/master/src/search.ts#L694)): Multi-project search with comprehensive path matching
- **[Content-aware truncation](https://en.wikipedia.org/wiki/Text_segmentation)** ([smartTruncation](https://github.com/Vvkmnn/claude-historian/blob/master/src/formatter.ts#L46)): Intelligent content boundaries over arbitrary character limits
- **[Technical content prioritization](https://en.wikipedia.org/wiki/Information_extraction)** ([BeautifulFormatter](https://github.com/Vvkmnn/claude-historian/blob/master/src/formatter.ts#L15)): Code blocks, errors, and file paths get full preservation
- **[Query similarity clustering](https://en.wikipedia.org/wiki/Cluster_analysis)** ([findSimilarQueries](https://github.com/Vvkmnn/claude-historian/blob/master/src/search.ts#L811)): Semantic expansion and pattern grouping for related questions

**File access:**

- Reads from: `~/.claude/conversations/`
- Zero persistent storage or indexing
- Never leaves your machine

## performance

See [PERF.md](./PERF.md) for benchmarks, optimization history, and quality scores.

**Current (v1.0.2)**: 4/7 tools at ≥4.0/5, targeting all 7. Focus: structured JSON output for Claude Code consumption.

## development

```bash
git clone https://github.com/vvkmnn/claude-historian && cd claude-historian
npm install && npm run build
npm test
```

**Package requirements:**

- **Node.js**: >=20.0.0 (ES modules support)
- **npm**: >=10.0.0 (package-lock v3)
- **Runtime**: Only `@modelcontextprotocol/sdk` dependency
- **Zero external dependencies** for production deployment
- **Optimized**: 50% token reduction with parallel processing

**Development workflow:**

```bash
npm run build          # TypeScript compilation with executable permissions
npm run dev            # Watch mode with tsc --watch
npm run start          # Run the MCP server directly
npm run lint           # ESLint code quality checks
npm run lint:fix       # Auto-fix linting issues
npm run format         # Prettier formatting (src/)
npm run format:check   # Check formatting without changes
npm run type-check     # TypeScript validation without emit
npm run test           # Run help command + type check
npm run prepublishOnly # Pre-publish validation (build + lint + format:check)
```

Contributing:

- Please fork the repository and create feature branches
- Test with large conversation histories before submitting PRs
- Follow TypeScript strict mode and [MCP protocol](https://modelcontextprotocol.io/specification) standards

Learn from examples:

- [Official MCP servers](https://github.com/modelcontextprotocol/servers) for reference implementations
- [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) for best practices
- [Creating Node.js modules](https://docs.npmjs.com/creating-node-js-modules) - NPM package development guide

## desktop

Claude Desktop support is currently blocked by [LevelDB locks](https://github.com/Level/level#open) and [Electron sandboxing](https://www.electronjs.org/docs/latest/tutorial/sandbox). You will still search Claude Desktop from Claude Code, but **only when the Claude app is closed**.

A DXT package and build is available for future compatibility; further investigations are ongoing. Feel free to test with it.

## license

[MIT](LICENSE)

---

![Claude Fauchet](https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Claude_Fauchet_par_Thomas_de_Leu.jpg/336px-Claude_Fauchet_par_Thomas_de_Leu.jpg)

_Claude Fauchet (1744-1793), French Historian_
