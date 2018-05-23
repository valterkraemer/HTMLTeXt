'use strict'

import App from './app'

window.HtApp = App

window.htApp = new App({
  el: 'body'
})

window.addEventListener('load', () => {
  window.htApp.bootstrap()
    .catch(err => console.error(err))
})
