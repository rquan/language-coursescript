'use babel'

import { Emitter } from 'atom'
import { ScrollView } from 'atom-space-pen-views'
import React from 'react'
import ReactDom from 'react-dom'
import App from '../components/App.jsx'

export default class LanguageCoursescriptView extends ScrollView {
  static content() {
    return this.div({ class: 'language-coursescript' })
  }

  constructor(url) {
    super()
    this.emitter_ = new Emitter()
    this.pane_ = null
    this.url_ = url
    this.title_ = 'Language CourseScript Preview'
  }

  setView(text) {
    ReactDom.render(
      <App plainText={text} onError={this.handleViewError} onChange={this.handleViewChange} />,
      this.element
    )
  }

  handleViewError(err) {
    atom.notifications.addError(err.message)
  }

  handleViewChange = (line) => {
    this.emitter_.emit('did-view-change', { line })
  }

  attached() {
    const paneItems = atom.workspace.getPanes()
    this.pane_ = paneItems.find(pane => {
      const items = pane.getItems()
      const view = items.filter(i => i instanceof ScrollView && i.url_ === this.getUrl())
      return view.length
    })
    this.pane_.activateItem(this)
  }

  onDidPaneDestroy(cb) {
    this.emitter_.on('did-pane-destroy', cb)
  }

  onViewChange(cb) {
    this.emitter_.on('did-view-change', cb)
  }

  destroy() {
    this.emitter_.emit('did-pane-destroy')
    this.pane_.destroyItem(this)
    if (this.pane_.getItems().length === 0) {
      this.pane_.destroy()
    }
  }

  getTitle() {
    return this.title_
  }

  getUrl() {
    return this.url_
  }
}
