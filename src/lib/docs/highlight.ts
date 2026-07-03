import { createHighlighter, type Highlighter } from 'shiki';

const THEME = 'github-dark';
const SHIKI_LANGS = ['bash', 'javascript', 'python', 'php', 'ruby', 'go', 'java', 'csharp'];

/** Map our language ids to shiki grammar ids. */
const LANG_MAP: Record<string, string> = {
  curl: 'bash',
  node: 'javascript',
  python: 'python',
  php: 'php',
  ruby: 'ruby',
  go: 'go',
  java: 'java',
  csharp: 'csharp',
};

let highlighterPromise: Promise<Highlighter> | null = null;
function getHighlighter() {
  return (highlighterPromise ??= createHighlighter({ themes: [THEME], langs: SHIKI_LANGS }));
}

/**
 * Highlight a snippet to HTML. The inline background is stripped so our own dark panel shows
 * through uniformly (shiki otherwise sets a per-theme background on the &lt;pre&gt;).
 */
export async function highlight(code: string, langId: string): Promise<string> {
  const highlighter = await getHighlighter();
  const html = highlighter.codeToHtml(code, { lang: LANG_MAP[langId] ?? 'bash', theme: THEME });
  return html.replace(/background-color:\s*#[0-9a-fA-F]+;?/g, 'background-color:transparent;');
}
