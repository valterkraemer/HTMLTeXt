import Directive from './directive'

export default class FootnoteDirective extends Directive {
  link () {
    const FootnoteService = this.app.services.FootnoteService

    const footnote = FootnoteService.add({
      content: this.element.innerHTML
    })

    let innerHTML = ''

    if (
      this.element.previousSibling &&
      this.element.previousSibling.tagName === 'FOOTNOTE'
    ) {
      innerHTML += ','
    }

    innerHTML += `<a href="#${footnote.ref}">${footnote.chapterNumber}</a>`

    this.element.innerHTML = innerHTML

    const elementRefs = this.app.getTemplate('footnote')
    this.footnoteElement = elementRefs.root

    elementRefs.a.setAttribute('name', footnote.ref)
    elementRefs.number.textContent = footnote.chapterNumber
    elementRefs.content.innerHTML = footnote.content

    const treeNode = this.treeNode.createChild(elementRefs.root)
    return treeNode.run('link')
  }
}

FootnoteDirective.selector = 'footnote'
