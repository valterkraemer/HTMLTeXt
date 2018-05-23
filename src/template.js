export default class Template {
  constructor (text) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(text, 'text/html')
    this.$templateNode = doc.body.children[0]
  }

  getClone () {
    const clone = this.$templateNode.cloneNode(1)

    return Object.assign({
      root: clone
    }, this.getReferences(clone))
  }

  getReferences (element) {
    const references = {}

    const attrs = element.attributes

    for (let i = 0; i < attrs.length; i++) {
      if (attrs[i].name.startsWith('#')) {
        references[attrs[i].name.slice(1)] = element
      }
    }

    for (let i = 0; i < element.children.length; i++) {
      Object.assign(references, this.getReferences(element.children[i]))
    }

    return references
  }
}
