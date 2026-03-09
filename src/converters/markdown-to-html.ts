/**
 * Convert Obsidian Markdown to Ghost HTML
 *
 * This is a basic converter. For production, consider using a library like:
 * - @tryghost/kg-default-transforms
 * - marked or showdown for markdown parsing
 */

/**
 * Basic Markdown to HTML converter
 */
export function markdownToHtml(markdown: string): string {
	let html = markdown;

	// Convert members-only paywall marker (only the last occurrence is kept)
	html = html.replace(/^--members-only--$/gim, '<!--members-only-->');

	// Convert headings
	html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
	html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
	html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

	// Convert bold
	html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
	html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

	// Convert italic
	html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
	html = html.replace(/_(.+?)_/g, '<em>$1</em>');

	// Convert inline code
	html = html.replace(/`(.+?)`/g, '<code>$1</code>');

	// Convert code blocks
	html = html.replace(/```(\w+)?\n([\s\S]+?)```/g, (_: string, lang: string | undefined, code: string) => {
		const language = lang ?? '';
		return `<pre><code class="language-${language}">${escapeHtml(code.trim())}</code></pre>`;
	});

	// Convert links - [text](url)
	html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

	// Convert images - ![alt](url)
	html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');

	// Convert blockquotes
	html = html.replace(/^> (.+)$/gim, '<blockquote>$1</blockquote>');

	// Convert unordered lists
	html = html.replace(/^\* (.+)$/gim, '<li>$1</li>');
	html = html.replace(/^- (.+)$/gim, '<li>$1</li>');
	html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

	// Convert ordered lists
	html = html.replace(/^\d+\. (.+)$/gim, '<li>$1</li>');

	// Convert horizontal rules
	html = html.replace(/^---$/gim, '<hr />');
	html = html.replace(/^\*\*\*$/gim, '<hr />');

	// Convert line breaks to paragraphs
	const paragraphs = html.split(/\n\n+/);
	html = paragraphs
		.map(para => {
			// Don't wrap if already has HTML tags
			if (para.match(/^<[^>]+>/)) {
				return para;
			}
			// Don't wrap empty lines
			if (para.trim() === '') {
				return '';
			}
			return `<p>${para.replace(/\n/g, '<br />')}</p>`;
		})
		.join('\n');

	return html.trim();
}

/**
 * Escape HTML entities
 */
function escapeHtml(text: string): string {
	const map: Record<string, string> = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
	};
	return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Ensure at most one --members-only-- marker exists in the content.
 * If multiple are found, keeps only the last one and removes the others.
 * Returns the cleaned content (or the original if zero or one marker).
 */
export function normalizePaywallMarker(content: string): string {
	const MARKER = '--members-only--';
	const lines = content.split('\n');
	const markerIndices: number[] = [];

	for (let i = 0; i < lines.length; i++) {
		if (lines[i].trim() === MARKER) {
			markerIndices.push(i);
		}
	}

	if (markerIndices.length <= 1) return content;

	// Keep only the last marker — remove all earlier ones
	const toRemove = new Set(markerIndices.slice(0, -1));
	return lines.filter((_, i) => !toRemove.has(i)).join('\n');
}

/**
 * Extract title from markdown (first H1)
 */
export function extractTitle(markdown: string): string {
	const h1Match = markdown.match(/^#\s+(.+)$/m);
	if (h1Match) {
		return h1Match[1].trim();
	}

	// Fallback: first line
	const firstLine = markdown.split('\n')[0];
	return firstLine.trim() || 'Untitled';
}

/**
 * Generate slug from title.
 *
 * Steps:
 * 1. NFD-normalise to decompose accented characters (é → e + ́)
 * 2. Strip combining diacritical marks (Unicode category Mn) so that
 *    accented letters become their ASCII base (é → e, ã → a, ç → c).
 * 3. Lowercase and replace any run of non-alphanumeric chars with a hyphen.
 * 4. Trim leading/trailing hyphens.
 *
 * Examples:
 *   "Três Níveis" → "tres-niveis"
 *   "Parte 2: Três Níveis"  → "parte-2-tres-niveis"
 */
export function generateSlug(title: string): string {
	return title
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '') // strip combining diacritics
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}
