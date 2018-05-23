import Directive from './directive'

export default class FigureDirective extends Directive {
  link () {
    const FiguresService = this.app.services.FiguresService
    const RefService = this.app.services.RefService
    const ignore = this.element.getAttribute('ignore') !== null
    const type = this.element.getAttribute('type') || 'Figure'

    const ref = RefService.add(this.element)

    const result = FiguresService.add({
      ref: ref.ref,
      ignore,
      type
    })

    const figcaption = this.element.querySelector('figcaption')
    if (figcaption) {
      const b = document.createElement('b')
      b.textContent = `${result.type} ${result.content}: `
      figcaption.insertBefore(b, figcaption.firstChild)
    }

    ref.value = result.content
    this.insertBeforeElement = ref.insertBeforeElement
  }
}

FigureDirective.selector = 'figure'
