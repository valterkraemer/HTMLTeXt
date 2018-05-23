import { join as pathJoin, dirname as pathDirname } from 'path'

import Directive from './directive'

export default class Img extends Directive {
  link () {
    let path
    let pathElement = this.element
    while (!path && pathElement) {
      path = pathElement.path
      pathElement = pathElement.parentNode
    }
    path = path || ''

    const srcAttr = this.element.getAttribute('src')
    const folder = pathDirname(path)
    const filePath = pathJoin(folder, srcAttr)
    this.element.setAttribute('src', filePath)

    return new Promise((resolve, reject) => {
      if (this.element.complete) {
        return resolve()
      }

      this.element.onload = resolve
      this.element.onerror = reject
    })
  }
}

Img.selector = 'img'
