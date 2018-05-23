import Directive from './directive'

export default class RefDirective extends Directive {
  link () {
    const RefService = this.app.services.RefService

    const key = this.element.textContent

    this.app.hook('post-compile', () => {
      const item = RefService.get(key)

      if (!item) {
        throw new Error(`Ref element ${key} does not exist`)
      }

      this.element.innerHTML = `<a href="#${item.ref}">${item.value}</a>`
    })
  }
}

RefDirective.selector = 'ref'
