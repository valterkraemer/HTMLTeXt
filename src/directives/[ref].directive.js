import Directive from './directive'

export default class RefAttrDirective extends Directive {
  constructor (element, app, treeNode) {
    super(element, app, treeNode)
    this.priority = 2000
  }

  link () {
    if (this.element.ref) {
      return
    }

    console.error('Ref element', this.element)
    throw new Error('Cannot ref element')
  }
}

RefAttrDirective.selector = '[ref]'
