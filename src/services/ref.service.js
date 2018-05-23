export default class RefService {
  constructor (app) {
    this.app = app

    this.refCounter = 0
    this.references = {}
  }

  source (key, text) {
    this.references[key] = text
  }

  get (key) {
    return this.references[key]
  }

  add (element) {
    const ref = element.getAttribute('ref') || `ref-${++this.refCounter}`

    if (this.references[ref]) {
      throw new Error(`Ref "${ref}" already exists`)
    }

    element.ref = ref

    const aElem = document.createElement('a')
    aElem.classList.add('ref-anchor')
    aElem.setAttribute('name', ref)

    const item = {
      ref: ref,
      insertBeforeElement: aElem
    }

    this.references[ref] = item
    return item
  }
}

RefService.serviceName = 'RefService'
