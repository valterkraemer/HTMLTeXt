import Directive from './directive'

export default class AbbrDirective extends Directive {
  link () {
    const AbbrService = this.app.services.AbbrService

    const key = this.element.textContent

    this.app.hook('post-compile', () => {
      const item = AbbrService.get(key)

      if (!item) {
        console.warn(`Abbrevation for key "${key}" does not exist`)
        return
      }

      this.element.innerHTML = `<a href="#${item.ref}">${item.abbr}</a>`
    })
  }
}

AbbrDirective.selector = 'abbr'
