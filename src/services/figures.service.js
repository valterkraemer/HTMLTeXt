export default class FiguresService {
  constructor (app) {
    this.app = app

    this.figures = []
    this.documentCounter = 0
    this.chapterCounters = {}
  }

  add (item) {
    const HeadingsService = this.app.services.HeadingsService
    const chapter = HeadingsService.currentChapter.chapter

    if (!item.ignore) {
      this.documentCounter++

      if (!this.chapterCounters[chapter]) {
        this.chapterCounters[chapter] = {}
      }

      if (!this.chapterCounters[chapter][item.type]) {
        this.chapterCounters[chapter][item.type] = 0
      }

      this.chapterCounters[chapter][item.type]++
    }

    const figure = {
      documentNumber: this.documentCounter,
      chapterNumber: this.chapterCounters[chapter][item.type],
      content: `${chapter}.${this.chapterCounters[chapter][item.type]}`,
      ref: item.ref,
      type: item.type
    }

    this.figures.push(figure)

    return figure
  }

  get currentChapter () {
    for (var i = this.headings.length - 1; i >= 0; i--) {
      const heading = this.headings[i]
      if (heading.size === 1) {
        return heading
      }
    }

    throw new Error('No suitable chapter')
  }
}

FiguresService.serviceName = 'FiguresService'
