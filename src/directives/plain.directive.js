import Directive from './directive'

export default class PlainDirective extends Directive {
  link () {
    const text = this.element.getAttribute('text')
    this.element.append(document.createTextNode(text))
  }
}

PlainDirective.selector = 'plain'
