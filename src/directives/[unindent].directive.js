import Directive from './directive'

export default class UnindentAttrDirective extends Directive {
  link () {
    this.element.unindent = true
  }
}

UnindentAttrDirective.selector = '[unindent]'
