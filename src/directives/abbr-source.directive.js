import Directive from './directive'

export default class AbbrSourceDirective extends Directive {
  link () {
    const AbbrService = this.app.services.AbbrService

    const abbr = AbbrService.source({
      abbr: this.element.getAttribute('abbr'),
      description: this.element.textContent
    })

    const elementRefs = this.app.getTemplate('abbr-source')

    elementRefs.a.setAttribute('name', abbr.ref)
    elementRefs.abbr.textContent = abbr.abbr
    elementRefs.description.textContent = abbr.description

    this.element.innerHTML = ''
    this.element.append(elementRefs.root)
  }
}

AbbrSourceDirective.selector = 'abbr-source'
