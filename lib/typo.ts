/**
 * French typography for text set in the shared components: a non-breaking space before « : ? ! ; », so a
 * line never starts with the sign. The rule itself lives with the e-invoicing rules (lib/einvoice/rules.ts),
 * a folder the lead API ships on its own; this module gives the rest of the site a neutral entry point.
 */
import { typo } from './einvoice/rules';

/** Applies the French spacing to a string and leaves any other node (markup, elements) as it is. */
export function frenchSpacing<T>(node: T): T {
  return (typeof node === 'string' ? typo(node) : node) as T;
}
