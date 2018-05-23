export default class AbbrService {
  constructor (app) {
    this.app = app

    this.abbrevations = {}
  }

  source (item) {
    const abbr = {
      abbr: item.abbr,
      description: item.description,
      ref: `abbr-${item.abbr}`
    }

    this.abbrevations[item.abbr] = abbr
    return abbr
  }

  get (key) {
    return this.abbrevations[key]
  }
}

AbbrService.serviceName = 'AbbrService'
