import Directive from './directive'
import Prism from 'prismjs'

Prism.hooks.add('after-highlight', env => {
  // works only for <code> wrapped inside <pre data-line-numbers> (not inline)
  var pre = env.element.parentNode
  if (!pre || !/pre/i.test(pre.nodeName) || pre.className.indexOf('line-numbers') === -1) {
    return
  }

  var linesNum = (1 + env.code.split('\n').length)
  var lineNumbersWrapper

  let lines = new Array(linesNum)
  lines = lines.join('<span></span>')

  lineNumbersWrapper = document.createElement('span')
  lineNumbersWrapper.className = 'line-numbers-rows'
  lineNumbersWrapper.innerHTML = lines

  if (pre.hasAttribute('data-start')) {
    pre.style.counterReset = 'linenumber ' + (parseInt(pre.getAttribute('data-start'), 10) - 1)
  }
  env.element.appendChild(lineNumbersWrapper)
})

export default class CodeHighlightAttrDirective extends Directive {
  link () {
    Prism.highlightElement(this.element)
  }
}

CodeHighlightAttrDirective.selector = '[code-highlight]'
