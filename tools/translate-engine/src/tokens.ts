// Placeholder-token matchers, consolidated in one file so the pipeline and the
// validator share the same definitions of "what is a pipeline token".
//
// The pipeline masks non-prose constructs as __PREFIX_n__ tokens before sending
// text to a model and restores them afterward. Several call sites need to match
// these tokens, and each needs a slightly different set (some allow an optional
// underscore, some list a subset/superset of prefixes) - keeping them together
// here makes those differences visible and easy to keep in sync.
//
// All matchers are exported as FUNCTIONS returning a fresh RegExp: a global
// (`/g`) regex carries `lastIndex` state, so a shared instance can misbehave
// across call sites - a fresh one each call is always safe.

/**
 * Broad matcher: ANY `__WORD_n__` token, including legacy shapes with an
 * optional underscore before the digits (`__U0__`, `__T0__`) and transient
 * ones (`__ATTR_0__`). Used where we STRIP or DETECT-any token regardless of
 * exact prefix - e.g. the untranslated-leak check.
 */
export const anyToken = (): RegExp => /__[A-Z]+_?\d+__/g;

/**
 * The set a leftover token could be after a failed restore - the validator's
 * corrupt-output guard. Non-global, single-match probe (used with `.match`).
 */
export const leftoverToken = (): RegExp => /__(?:BLOCK|JSX|MDX|FENCE|URL|U|T)_?\d+__/;

/** Tokens the body-prose completion must return intact (token-integrity retry). */
export const pipelineToken = (): RegExp => /__(?:BLOCK|JSX|URL|MDX|FENCE)_\d+__/g;

/**
 * `__BLOCK_n__` / `__FENCE_n__` each stand for a whole, distinct code block and
 * must stay in the same relative order as the source - see realignBlockTokenOrder.
 *
 * `__JSX_n__` is deliberately NOT in this set. It masks MDX constructs (a JSX
 * tag, an `{expression}`, an import block), and a flattened inline element
 * contributes a SEPARATE open and close token around prose the model is asked
 * to translate - `__JSX_9__bold words__JSX_10__`. Target languages reorder
 * clauses (Japanese especially), so an inline pair legitimately moves relative
 * to its neighbours; positional realignment would then re-pair an opening tag
 * with somebody else's closing tag. Code blocks have no such freedom - they are
 * whole blocks in fixed document order - which is why only they are realigned.
 */
export const orderedBlockToken = (): RegExp => /__(?:BLOCK|FENCE)_\d+__/g;
