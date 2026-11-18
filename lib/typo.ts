/**
 * French typography for text the site sets itself: a non-breaking space before « : ? ! ; » and inside the
 * « guillemets », so a line never starts with a sign or a closing guillemet, nor ends on an opening one.
 * The rule for the signs lives with the e-invoicing rules (lib/einvoice/rules.ts), a folder the lead API
 * ships on its own; this module adds the guillemets and gives the rest of the site a neutral entry point,
 * for plain strings and for the articles' markdown.
 */
import { typo } from './einvoice/rules';

/** Non-breaking space, the same one typo() puts before the signs. */
const NBSP = ' ';

/** Applies the French spacing to a piece of running text. */
export function frenchText(s: string): string {
  return typo(s).replace(/« /g, `«${NBSP}`).replace(/ »/g, `${NBSP}»`);
}

/** Applies the French spacing to a string and leaves any other node (markup, elements) as it is. */
export function frenchSpacing<T>(node: T): T {
  return (typeof node === 'string' ? frenchText(node) : node) as T;
}

/** The part of a rehype node (HTML syntax tree) the plugin below reads. */
interface HtmlNode {
  type: string;
  tagName?: string;
  value?: string;
  children?: HtmlNode[];
}

/**
 * Rehype plugin for the articles: applies the French spacing to every text of the rendered markdown, except
 * inside code, whose spaces are content (an invoice example, a formula). Runs after rehype-slug, so the
 * heading anchors stay those the table of contents and existing links expect.
 */
export function rehypeFrenchSpacing() {
  const visit = (node: HtmlNode): void => {
    if (node.type === 'element' && (node.tagName === 'pre' || node.tagName === 'code')) return;
    if (node.type === 'text' && node.value) node.value = frenchText(node.value);
    node.children?.forEach(visit);
  };
  return (tree: HtmlNode) => visit(tree);
}
