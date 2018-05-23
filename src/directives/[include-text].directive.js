import { join as pathJoin, dirname as pathDirname } from 'path'

import Directive from './directive'

export default class IncludeTextAttrDirective extends Directive {
  constructor (element, app, treeNode) {
    super(element, app, treeNode)
    this.priority = 900
  }

  link () {
    let path
    let pathElement = this.element
    while (!path && pathElement) {
      path = pathElement.path
      pathElement = pathElement.parentNode
    }
    path = path || ''

    const src = this.element.getAttribute('include-text')

    if (!src) {
      throw new Error(`Value for "include-text" is required`)
    }

    const folder = pathDirname(path)
    const filePath = pathJoin(folder, src)

    this.element.path = filePath

    return fetch(filePath)
      .then(response => {
        if (response.status !== 200) {
          throw new Error(`Url: ${src} not found!`)
        }
        return response.text()
      })
      .then(text => {
        this.element.textContent = text
      })
  }
}

IncludeTextAttrDirective.selector = '[include-text]'
