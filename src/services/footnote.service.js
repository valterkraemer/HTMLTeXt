export default class FootnoteService {
  constructor (app) {
    this.app = app

    this.footnotes = []
    this.documentCounter = 0
    this.chapterCounters = {}
  }

  add (item) {
    const HeadingsService = this.app.services.HeadingsService
    const chapter = HeadingsService.currentChapter.chapter

    this.documentCounter++
    this.chapterCounters[chapter] = this.chapterCounters[chapter] || 0
    this.chapterCounters[chapter]++

    const footnote = {
      documentNumber: this.documentCounter,
      chapterNumber: this.chapterCounters[chapter],
      content: item.content,
      ref: `ht-footnote-${chapter}-${this.chapterCounters[chapter]}`
    }

    this.footnotes.push(footnote)

    return footnote
  }
}

FootnoteService.serviceName = 'FootnoteService'
