'use strict'

import Promise from 'bluebird'

import TreeNode from './tree-node'

export default function (app) {
  app.$refs = app.getTemplate('app')

  return (function loop () {
    const firstChild = app.element.firstChild
    if (!firstChild) {
      return Promise.resolve()
    }

    app.$refs.flat.appendChild(firstChild)

    const treeNode = new TreeNode(firstChild, app)
    app.rootNodes.push(treeNode)

    return treeNode.run('link')
      .then(loop)
  })()
    .then(() => {
      app.element.appendChild(app.$refs.root)
    })
}
