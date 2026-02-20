// Scoring constants for Claude Code conversation relevance
// These weights are tuned based on what makes conversations most useful for Claude

// Scan limits — configurable caps for how many projects/files we search
export const MAX_PROJECTS_SEARCH = 30;
export const MAX_FILES_PER_PROJECT_SEARCH = 15;
export const MAX_PROJECTS_SESSIONS = 30;
export const MAX_FILES_PER_PROJECT_SESSIONS = 15;

// Core scoring weights
export const EXACT_MATCH_SCORE = 10; // Exact tech term match (e.g., "react" query matches "React")
export const SUPPORTING_TERM_SCORE = 3; // 5+ char supporting terms
export const WORD_MATCH_SCORE = 2; // General word matches
export const EXACT_PHRASE_BONUS = 5; // Full query phrase appears
export const MAJORITY_MATCH_BONUS = 4; // 60%+ of query words match

// Context scoring weights
export const TOOL_USAGE_SCORE = 5; // Message uses tools
export const FILE_REFERENCE_SCORE = 3; // Contains file paths
export const PROJECT_MATCH_SCORE = 5; // Matches project context

// Stop words — only true natural-language filler that should never be scored
export const STOP_WORDS = new Set([
  'the',
  'and',
  'for',
  'with',
  'this',
  'that',
  'from',
  'into',
  'have',
  'been',
  'will',
  'just',
  'also',
  'some',
  'when',
  'what',
  'how',
  'does',
  'not',
  'but',
  'are',
  'was',
  'were',
  'can',
  'has',
  'had',
  'its',
  'your',
  'our',
  'you',
  'they',
]);
