import Directive from './directive'

export default class PageNumberDirective extends Directive {
  link () {
    const hide = this.element.getAttribute('hide')
    if (hide !== null) {
      this.element.hidePageNumber = getBoolean(hide)
    }

    const roman = this.element.getAttribute('roman')
    if (roman !== null) {
      this.element.useRomanPageNumbers = getBoolean(roman)
    }

    const set = this.element.getAttribute('set')
    if (set !== null) {
      this.element.setPageNumber = parseInt(set)
    }

    function getBoolean (string) {
      if (string === 'true') {
        return true
      }

      if (string === 'false') {
        return false
      }
    }
  }
}

PageNumberDirective.selector = 'page-number'
