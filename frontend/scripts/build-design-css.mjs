import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync, unlinkSync } from 'node:fs'
import postcss from 'postcss'
import prefix from 'postcss-prefix-selector'
execFileSync(process.execPath, ['node_modules/@tailwindcss/cli/dist/index.mjs', '-i', 'src/designs/design-source.css', '-o', 'src/designs/.generated.css', '--minify'])
const result = await postcss([prefix({ prefix: '.provided-design', transform(prefix, selector, prefixed, file, rule) { if (rule.parent?.type === 'atrule' && /keyframes/.test(rule.parent.name)) return selector; if (/^(:root|:host|html|body)$/.test(selector)) return prefix; if (selector.startsWith('.provided-design')) return selector; return prefixed } })]).process(readFileSync('src/designs/.generated.css', 'utf8'), { from: undefined })
// Existing Bootstrap/auth CSS is unlayered. Flatten Tailwind layers so scoped
// utilities are not silently overridden by global element rules (e.g. button).
result.root.walkAtRules('layer', rule => {
  if (rule.nodes) rule.replaceWith(...rule.nodes)
  else rule.remove()
})
writeFileSync('src/designs/design.generated.css', result.root.toString())
unlinkSync('src/designs/.generated.css')
