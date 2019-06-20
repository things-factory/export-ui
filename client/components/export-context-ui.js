import { css, html, LitElement } from 'lit-element'
import { connect } from 'pwa-helpers'

import '@material/mwc-icon/mwc-icon'

import { EXPORT } from '@things-factory/export-base'
import { TOGGLE_OVERLAY } from '@things-factory/layout-base'
import { store } from '@things-factory/shell'

class ExportContextUI extends connect(store)(LitElement) {
  static get properties() {
    return {
      _context: Object,
      _extensions: Array
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-direction: column;
          margin: auto 0 0 0;
          max-height: 30vh;
          background-color: #cf4545;
        }

        ul {
          margin: 0;
          padding: 0;
          color: #fff;
          list-style: none;
          height: 100%;
          overflow-y: auto;
        }

        li {
          display: flex;
        }

        li > mwc-icon {
          padding: 10px;
        }

        li > span {
          margin: auto 0 auto 0;
          flex: 1;
        }

        li > input {
          margin: auto 10px;
        }

        mwc-button {
          margin-right: auto;
          padding: 0 10px;
        }
      `
    ]
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
            type: 'warn',
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

    store.dispatch({
      type: TOGGLE_OVERLAY,
      overlay: { show: false }
    })
  }

  stateChanged(state) {
    this._extensions = (state.exporting && state.exporting.extensions) || []
    this._context = state.route.context
  }
}

window.customElements.define('export-context-ui', ExportContextUI)
