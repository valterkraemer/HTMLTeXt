export default class Directive {
  constructor (element, app, treeNode) {
    this.priority = 1000

    this.element = element
    this.app = app
    this.treeNode = treeNode
  }
}
