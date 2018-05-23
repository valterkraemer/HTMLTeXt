import Directive from './directive'

export default class BibliographyDirective extends Directive {
  link () {
    this.element.unindent = true

    const BibliographyService = this.app.services.BibliographyService

    this.app.hook('post-compile', () => {
      const cited = BibliographyService.cited

      cited.forEach((item, index) => {
        const elementRefs = this.app.getTemplate('bibliography-item')
        elementRefs.a.setAttribute('name', `${item.ref}`)

        elementRefs.number.textContent = `[${index + 1}]`
        elementRefs.author.textContent = item.author
        elementRefs.title.textContent = item.title
        elementRefs.note.textContent = item.note

        this.element.append(elementRefs.root)
        this.treeNode.createChild(elementRefs.root)
      })
    })
  }
}

BibliographyDirective.selector = 'bibliography'
