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

    this.extension = extensions.length > 0 ? extensions[0] : null

    return html`
      <ul>
        ${extensions.map(
          (extension, idx) => html`
            <label for="${idx}">
              <li>
                <mwc-icon>description</mwc-icon>
                <span>${extension}</span>
                <input
                  id="${idx}"
                  type="radio"
                  name="extensions"
                  @change="${() => {
                    this.extension = extension
                  }}"
                  ?checked="${idx === 0}"
                />
              </li>
            </label>
          `
        )}
      </ul>

      <mwc-button @click=${this._export.bind(this)}>Export to...</mwc-button>
    `
  }

  _export() {
    if (!this.extension) {
      document.dispatchEvent(
        new CustomEvent('notify', {
          detail: {
            level: 'warn',
            message: 'Extension is not selected.'
          }
        })
      )

      return
    }

    store.dispatch({
      type: EXPORT,
      exportable: {
        extension: this.extension,
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
