import Directive from './directive'

export default class TableOfContents extends Directive {
  link () {
    this.element.unindent = true

    const HeadingsService = this.app.services.HeadingsService

    this.app.hook('post-compile', () => {
      const headings = HeadingsService.headings

      headings
        .filter(heading => {
          return !heading.ignore
        })
        .forEach(heading => {
          const elementRefs = this.app.getTemplate('table-of-contents')

          elementRefs.a.setAttribute('href', `#${heading.ref}`)
          elementRefs.a.classList.add(`toc-heading-${heading.size}`)

          elementRefs.chapter.textContent = heading.chapter
          elementRefs.name.textContent = heading.name

          this.element.append(elementRefs.root)

          this.treeNode.createChild(elementRefs.root)

          this.app.hook('post-split', () => {
            elementRefs.page.textContent = heading.pageNumber
          })
        })
    })
  }
}

TableOfContents.selector = 'table-of-contents'
