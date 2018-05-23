export default class HeadingsService {
  constructor (app) {
    this.app = app

    this.numbers = [0, 0, 0, 0, 0]
    this.headings = []
    this.ignoreCounter = 0
  }

  add (item) {
    let index = item.size - 1

    if (!item.ignore) {
      this.numbers[index]++

      for (index++; index < this.numbers.length; index++) {
        this.numbers[index] = 0
      }
    }

    const chapter = this.numbers.slice(0, item.size).join('.')

    const heading = {
      size: item.size,
      chapter: chapter,
      name: item.name,
      element: item.element,
      ref: item.ref,
      ignore: item.ignore
    }

    this.headings.push(heading)
    return heading
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

HeadingsService.serviceName = 'HeadingsService'
