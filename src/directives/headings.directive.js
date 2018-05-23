import Directive from './directive'

class Heading extends Directive {
  constructor (element, app, size) {
    super(element, app)
    this.size = size
  }

  link () {
    const HeadingsService = this.app.services.HeadingsService
    const RefService = this.app.services.RefService
    const ignore = this.element.getAttribute('ignore') !== null

    const ref = RefService.add(this.element)

    this.data = HeadingsService.add({
      size: this.size,
      name: this.element.textContent,
      element: this.element,
      ref: ref.ref,
      ignore
    })

    this.element.heading = this.data

    ref.value = this.data.chapter
    this.insertBeforeElement = ref.insertBeforeElement

    this.setValue(this.data, ignore)
  }

  setValue (item, ignore) {
    const elementRefs = this.app.getTemplate(`h${this.size}`)

    this.element.innerHTML = ''
    this.element.appendChild(elementRefs.root)

    if (!ignore) {
      elementRefs.chapter.textContent = item.chapter
    }
    elementRefs.name.textContent = item.name
  }

  setPageNumber (pageNumber) {
    this.data.pageNumber = pageNumber
  }
}

export class H1 extends Heading {
  constructor (element, app) {
    super(element, app, 1)
  }
}
H1.selector = 'h1'

export class H2 extends Heading {
  constructor (element, app) {
    super(element, app, 2)
  }
}
H2.selector = 'h2'

export class H3 extends Heading {
  constructor (element, app) {
    super(element, app, 3)
  }
}
H3.selector = 'h3'

export class H4 extends Heading {
  constructor (element, app) {
    super(element, app, 4)
  }
}
H4.selector = 'h4'

export class H5 extends Heading {
  constructor (element, app) {
    super(element, app, 5)
  }
}
H5.selector = 'h5'
