export default class StatusService {
  constructor (app) {
    this.app = app

    this.$refs = app.getTemplate('status')

    app.element.append(this.$refs.root)
  }

  set (text, percent) {
    this.$refs.text.textContent = text
    if (typeof percent !== 'undefined') {
      this.$refs.bar.style.width = percent + '%'
    }
  }

  remove () {
    this.$refs.root.remove()
  }
}

StatusService.serviceName = 'StatusService'
