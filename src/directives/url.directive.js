import Directive from './directive'

export default class UrlDirective extends Directive {
  link () {
    const url = this.element.textContent
    this.element.innerHTML = `<a href="${url}">${url}</a>`
  }
}

UrlDirective.selector = 'url'
