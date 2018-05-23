import { join as pathJoin, dirname as pathDirname } from 'path'
import Promise from 'bluebird'

import Directive from './directive'

export default class HtInput extends Directive {
  link () {
    this.element.unindent = true

    let path
    let pathElement = this.element
    while (!path && pathElement) {
      path = pathElement.path
      pathElement = pathElement.parentNode
    }
    path = path || ''

    const src = this.element.getAttribute('src')

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
      .then(html => {
        var parser = new DOMParser()
        var doc = parser.parseFromString(html, 'text/html')
        while (doc.body.firstChild) {
          this.treeNode.createChild(doc.body.firstChild)
          this.element.append(doc.body.firstChild)
        }

        return Promise.mapSeries(this.treeNode.children, treeNode => {
          return treeNode.run('link')
        })
      })
  }
}

HtInput.selector = 'ht-input'
