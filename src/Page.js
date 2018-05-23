'use strict'

export default class Page {
  constructor (params) {
    this.$refs = params.template
    this.element = this.$refs.root

    if (params.heading) {
      this.setChapter(params.heading)
    }

    this.setPageNumber(params.pageNumber, params.useRoman)
  }

  setPageNumber (number, useRoman) {
    if (useRoman) {
      const convert = {
        1: 'i',
        2: 'ii',
        3: 'iii',
        4: 'iv',
        5: 'v',
        6: 'vi',
        7: 'vii',
        8: 'viii',
        9: 'ix'
      }

      let roman = new Array(Math.floor(number / 10)).fill('x')
      roman.unshift(convert[number % 10])

      this.pageNumber = roman.join('')
      this.$refs['number-bottom'].textContent = this.pageNumber
      this.$refs['number-top'].textContent = ''
    } else {
      this.pageNumber = number
      this.$refs['number-bottom'].textContent = ''
      this.$refs['number-top'].textContent = this.pageNumber
    }
  }

  setChapter (heading) {
    if (heading && !heading.ignore) {
      this.$refs.title.textContent = `Chapter ${heading.chapter}. ${heading.name}`
    } else {
      this.$refs.title.textContent = ''
    }
  }

  append (item) {
    this.$refs.content.appendChild(item.element)

    if (item.directives) {
      item.directives.forEach(directive => {
        if (directive.footnoteElement) {
          this.$refs.footnotes.appendChild(directive.footnoteElement)
        }

        if (directive.insertBeforeElement) {
          this.$refs.content.insertBefore(
            directive.insertBeforeElement,
            item.element
          )
        }

        if (directive.setPageNumber) {
          directive.setPageNumber(this.pageNumber)
        }
      })
    }
  }

  isEmpty () {
    return !this.$refs.content.innerHTML.match(/\S/)
  }

  get overflowing () {
    const content = this.$refs.content
    return Math.abs(content.scrollHeight - content.clientHeight) > 1
  }
}
