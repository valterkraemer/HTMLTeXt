import Promise from 'bluebird'

import parser from '../../lib/parser'

export default class BibliographyService {
  constructor () {
    const elements = document.head.querySelectorAll('link[rel=bibliography]')

    this.cited = []
    this.documentCounter = 0

    this.files = Array.from(elements)
      .filter(element => {
        return element.href && element.href.endsWith('.bib')
      })
      .map(element => {
        return element.href
      })
  }

  register (key) {
    return this.getBibliography()
      .then(bibliography => {
        const keys = key.split(',')

        return keys.map(key => {
          const item = bibliography[key]

          if (!item) {
            throw new Error(`Key "${key}" not in bibliography`)
          }

          if (!this.cited.includes(item)) {
            item.documentCounter = ++this.documentCounter
            this.addCite(item)
          }

          return item
        })
      })
  }

  getBibliography () {
    if (this.bibliography) {
      return Promise.resolve(this.bibliography)
    }

    return Promise.map(this.files, file => {
      return fetch(file)
        .then(response => {
          if (response.status !== 200) {
            return Promise.reject(new Error(`File at path: ${file} not found`))
          }
          return response.text()
        })
        .then(text => {
          const bibtex = parser(text)
          if (bibtex.error) {
            console.error(bibtex.error)
          }
          return bibtex.entries
        })
    })
      .then(results => {
        const flat = [].concat.apply([], results)

        return flat.reduce((result, item) => {
          result[item.EntryKey] = Object.assign({}, item.Fields, {
            ref: `bibliography-${item.EntryKey}`
          })
          return result
        }, {})
      })
      .then(bibliography => {
        this.bibliography = bibliography
        return bibliography
      })
  }

  addCite (item) {
    let index = this.cited.findIndex(cite => {
      return cite.author.localeCompare(item.author) === 1
    })

    if (index === -1) {
      index = 0
    }

    this.cited.splice(index, 0, item)
  }
}

BibliographyService.serviceName = 'BibliographyService'
