import { css, html, LitElement } from 'lit-element'
import { connect } from 'pwa-helpers'

import '@material/mwc-icon'

import { store, ScrollbarStyles } from '@things-factory/shell'
import { EXPORT } from '@things-factory/export-base'
import { closeOverlay } from '@things-factory/layout-base'

import { ContextToolbarOverlayStyle } from '@things-factory/context-ui'

class ExportOverlayTemplate extends connect(store)(LitElement) {
  static get properties() {
    return {
      _context: Object,
      _extensions: Array
    }
  }

  static get styles() {
    return [ScrollbarStyles, ContextToolbarOverlayStyle]
  }

  render() {
    const extensions = []
    const exportable = this._context.exportable || {}
    const accept =
      exportable.accept instanceof Array
        ? exportable.accept
        : typeof exportable.accept == 'string'
        ? [exportable.accept]
        : null

    for (let extension in this._extensions) {
      if (!accept || accept.indexOf(extension) != -1) {
        extensions.push(extension)
      }
    }

    return html`
      <ul>
        ${extensions.map(
          (extension, idx) => html`
            <label for="${idx}">
              <li @click=${e => this._export(extension)}>
                <mwc-icon>description</mwc-icon>
                <span>${extension}</span>
              </li>
            </label>
          `
        )}
      </ul>
    `
  }

  _export(extension) {
    store.dispatch({
      type: EXPORT,
      exportable: {
        extension,
        ...this._context.exportable
      }
    })

    closeOverlay('context-toolbar-overlay')
  }

  stateChanged(state) {
    this._extensions = (state.exporting && state.exporting.extensions) || []
    this._context = state.route.context
  }
}

window.customElements.define('export-overlay-template', ExportOverlayTemplate)
