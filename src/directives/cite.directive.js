import Directive from './directive'

export default class CiteDirective extends Directive {
  link () {
    const BibliographyService = this.app.services.BibliographyService

    const key = this.element.textContent

    return BibliographyService.register(key)
      .then(items => {
        this.app.hook('post-compile', () => {
          const cites = items.map(item => {
            const number = BibliographyService.cited.indexOf(item) + 1
            return `<a href="#${item.ref}">${number}</a>`
          }).join(', ')

          this.element.innerHTML = `[${cites}]`
        })
      })
  }
}

CiteDirective.selector = 'cite'
