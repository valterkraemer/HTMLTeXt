'use strict'

import Promise from 'bluebird'

import './styles/index.scss'

import Directive from './directives/directive'

import { H1, H2, H3, H4, H5 } from './directives/headings.directive'
import abbr from './directives/abbr.directive'
import abbrSource from './directives/abbr-source.directive'
import BibliographyDirective from './directives/bibliography.directive'
import cite from './directives/cite.directive'
import CodeHighlightAttrDirective from './directives/[code-highlight].directive'
import FigureDirective from './directives/figure.directive'
import footnote from './directives/footnote.directive'
import htInput from './directives/ht-input.directive'
import Img from './directives/img.directive'
import IncludeTextAttrDirective from './directives/[include-text].directive'
import PageNumberDirective from './directives/page-number.directive'
import PlainDirective from './directives/plain.directive'
import RefAttrDirective from './directives/[ref].directive'
import RefDirective from './directives/ref.directive'
import TableOfContents from './directives/table-of-contents.directive'
import UnindentAttrDirective from './directives/[unindent].directive'
import url from './directives/url.directive'

import AbbrService from './services/abbr.service'
import BibliographyService from './services/bibliography.service'
import FiguresService from './services/figures.service'
import FootnoteService from './services/footnote.service'
import HeadingsService from './services/headings.service'
import RefService from './services/ref.service'
import StatusService from './services/status.service'

import compile from './compile'
import split from './split'

import Template from './template'
import templates from './templates'

const directives = {}
;[
  abbr,
  abbrSource,
  BibliographyDirective,
  cite,
  CodeHighlightAttrDirective,
  FigureDirective,
  footnote,
  H1,
  H2,
  H3,
  H4,
  H5,
  htInput,
  Img,
  IncludeTextAttrDirective,
  PageNumberDirective,
  PlainDirective,
  RefAttrDirective,
  RefDirective,
  TableOfContents,
  UnindentAttrDirective,
  url
].forEach(directive => {
  directives[directive.selector] = directive
})

const services = {}
;[
  AbbrService,
  BibliographyService,
  FiguresService,
  FootnoteService,
  HeadingsService,
  RefService,
  StatusService
].forEach(service => {
  services[service.serviceName] = service
})

export default class App {
  constructor (options) {
    if (!document.title) {
      document.title = 'HTMLTeXt'
    }

    options = options || {}

    Object.assign(this, {
      selector: options.el || 'body',
      nodes: [],
      rootNodes: [],
      $templates: {},
      $compileTemplates: {},
      directives,
      $services: services,
      services: {},
      hooks: {
        'pre-compile': [],
        'compile': [compile],
        'post-compile': [],
        'pre-split': [],
        'split': [
          // Wait for fonts to load
          () => document.fonts.ready,
          split
        ],
        'post-split': [() => {
          return Promise.delay(100)
        }, () => {
          // Ensure that pages does not overflow
          const pages = this.element.querySelectorAll('.ht-page-content')
          let overflowed = false
          for (var i = 0; i < pages.length; i++) {
            if (pages[i].scrollHeight > pages[i].clientHeight) {
              overflowed = overflowed || i
              // pages[i].style['background-color'] = 'red'
              pages[i].style['overflow'] = 'hidden'
            }
          }
          if (overflowed !== false) {
            // alert(`At least page ${overflowed} overflowed`)
          }
        }],
        'ready': [() => {
          this.services.StatusService.remove()

          document.body.scrollTop = sessionStorage.getItem('scrollTop')
          window.onscroll = () => {
            sessionStorage.setItem('scrollTop', document.body.scrollTop)
          }
        }]
      }
    })
  }

  bootstrap () {
    this.element = document.querySelector(this.selector)

    Object.keys(this.$services).forEach(key => {
      this.services[key] = new this.$services[key](this)
    })

    const hooks = Object.keys(this.hooks)
      .map(key => ({
        name: key,
        functions: this.hooks[key]
      }))

    return Promise.each(hooks, (hook, index) => {
      this.services.StatusService.set(hook.name, 100 * index / hooks.length)
      return Promise.mapSeries(hook.functions, func => {
        return Promise.delay(0)
          .then(() => func(this))
      })
    })
  }

  hook (name, func) {
    if (!this.hooks[name]) {
      throw new Error('Not valid hook')
    }

    this.hooks[name].push(func)
  }

  setTemplate (name, template) {
    window.htApp.$templates[name] = template
  }

  getTemplate (name) {
    if (!this.$compileTemplates[name]) {
      let text = this.$templates[name] || templates[name]

      if (!text) {
        throw new Error(`Template "${name}" does not exist`)
      }

      this.$compileTemplates[name] = new Template(text)
    }

    return this.$compileTemplates[name].getClone()
  }

  directive (directive) {
    this.directives[directive.selector] = directive
  }

  service (name, service) {
    this.$services[name] = service
  }
}

App.Directive = Directive
