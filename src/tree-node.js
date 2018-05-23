'use strict'

import Promise from 'bluebird'

export default class TreeNode {
  constructor (element, app, parent) {
    this.element = element
    this.app = app
    this.parent = parent

    this.children = []
    this.directives = []

    if (element.nodeType === Node.ELEMENT_NODE) {
      const ElementDirective = app.directives[element.tagName.toLowerCase()]
      if (ElementDirective) {
        this.addDirective(new ElementDirective(this.element, this.app, this))
      }

      const attrs = element.attributes

      for (let i = 0; i < attrs.length; i++) {
        const AttrDirective = app.directives[`[${attrs[i].name.toLowerCase()}]`]
        if (AttrDirective) {
          this.addDirective(new AttrDirective(this.element, this.app, this))
        }
      }

      for (let i = 0; i < element.childNodes.length; i++) {
        this.createChild(element.childNodes[i])
      }
    } else if (element.nodeType === Node.TEXT_NODE) {
      element.nodeValue = element.nodeValue
        .replace(/^\n+/, '')
        .replace(/\n+$/, '')
    }
  }

  addDirective (directive) {
    this.directives.push(directive)
    if (this.parent) {
      this.parent.addDirective(directive)
    }
  }

  createChild (element) {
    const child = new TreeNode(element, this.app, this)
    this.children.push(child)
    return child
  }

  run (name) {
    this.directives.sort((a, b) => {
      return a.priority - b.priority
    })

    return Promise.mapSeries(this.directives, directive => {
      if (directive[name]) {
        return directive[name]()
      }
    })
  }
}
