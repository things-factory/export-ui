import { store } from '@things-factory/shell'
import { css, html, LitElement } from 'lit-element'
import { connect } from 'pwa-helpers'
import { EXPORT } from '@things-factory/export-base'
import '@material/mwc-icon/mwc-icon'

class ExportContextUI extends connect(store)(LitElement) {
  static get properties() {
    return {
      _extensions: Object
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
    let extensions = []
    for (let key in this._extensions) {
      extensions.push(key)
    }

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

      <mwc-button
        @click="${() => {
          if (!this.extension) {
            document.dispatchEvent(
              new CustomEvent('notify', {
                detail: {
                  type: 'info',
                  message: 'Extension is not selected.'
                }
              })
            )
            return
          }
          document.dispatchEvent(
            new CustomEvent('export', {
              detail: {
                callback: params => this._dispatchAction(params)
              }
            })
          )
        }}"
        >Export to...</mwc-button
      >
    `
  }

  _dispatchAction(params) {
    store.dispatch({
      type: EXPORT,
      params
    })
  }

  stateChanged(state) {
    this._extensions = state && state.exporting && state.exporting.extensions
  }
}

window.customElements.define('export-context-ui', ExportContextUI)
