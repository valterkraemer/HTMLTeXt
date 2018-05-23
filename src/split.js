'use strict'

import Page from './Page'

export default function (app) {
  const pagesElem = app.$refs.pages

  let page
  let newPageBefore = true
  let newPageAfter = false // To be able to break before and after element

  let useRomanPageNumbers = false
  let pageNumber = 0
  let currentHeading

  let items = app.rootNodes.slice()
  let overflowElement

  for (let i = 0; i < items.length;) {
    const item = items[i]

    if (item.element.unindent) {
      var beforeArr = items.slice(0, i)
      var afterArr = items.slice(i + 1)
      items = [...beforeArr, ...item.children, ...afterArr]
      continue
    }

    if (typeof item.element.useRomanPageNumbers !== 'undefined') {
      useRomanPageNumbers = item.element.useRomanPageNumbers
    }

    if (typeof item.element.setPageNumber !== 'undefined') {
      pageNumber = item.element.setPageNumber
    }

    if (typeof item.element.hidePageNumber !== 'undefined') {
      page.setPageNumber('')
    }

    if (item.element.heading && item.element.heading.size === 1) {
      currentHeading = item.element.heading
    }

    if (newPageBefore) {
      newPageBefore = false
      page = addPage()
    } else if (newPageAfter) {
      newPageAfter = false
      page = addPage()
    }

    if (item.element.nodeType === Node.ELEMENT_NODE) {
      const style = window.getComputedStyle(item.element)

      const pageBreakAfter = style.getPropertyValue('break-after')

      if (pageBreakAfter && pageBreakAfter !== 'auto') {
        item.element.style.pageBreakAfter = 'auto'

        switch (pageBreakAfter) {
          case 'page':
            newPageAfter = true
        }
      }

      const pageBreakBefore = style.getPropertyValue('break-before')

      if (pageBreakBefore && pageBreakBefore !== 'auto') {
        item.element.style.pageBreakBefore = 'auto'

        switch (pageBreakBefore) {
          case 'page':
            // Contains something else than spaces and newlines
            if (!page.isEmpty()) {
              newPageBefore = true
              continue
            }
        }
      }
    }

    page.append(item)

    if (!page.overflowing) {
      i++
      continue
    }

    if (item.element.nodeType !== Node.TEXT_NODE) {
      if (overflowElement === item) {
        console.error('element', item.element)
        throw new Error('Element too large for page')
      }

      overflowElement = item

      newPageBefore = true
      continue
    }

    // Is text
    let clone = item.element.cloneNode(1)

    // Use binary search to find place were overflown
    let min = 0
    let max = clone.length
    let middle

    while (min < max) {
      middle = min + Math.ceil((max - min) / 2)

      item.element.nodeValue = clone.nodeValue.substring(0, middle)

      if (page.overflowing) {
        max = middle - 1
      } else {
        min = middle
      }
    }

    // Check if breakpoint should be at space or newline character
    var lastIndex = Math.max(
      item.element.nodeValue.lastIndexOf(' '),
      item.element.nodeValue.lastIndexOf('\n')
    )

    item.element.nodeValue = item.element.nodeValue.substring(0, lastIndex)

    clone.nodeValue = clone.nodeValue.substring(lastIndex + 1)

    items.splice(i + 1, 0, {
      element: clone
    })

    newPageBefore = true
    i++
  }

  app.$refs.flat.remove()

  function addPage () {
    const addedPage = new Page({
      template: app.getTemplate('page'),
      pageNumber: ++pageNumber,
      useRoman: useRomanPageNumbers,
      heading: currentHeading
    })

    pagesElem.appendChild(addedPage.element)
    return addedPage
  }
}
