import '@material/mwc-button/mwc-button'
import { APPEND_FOOTERBAR, TOOL_POSITION, TOGGLE_OVERLAY } from '@things-factory/layout-base'
import { store } from '@things-factory/shell'
import { html } from 'lit-html'

function toggleOverlayTemplate() {
  store.dispatch({
    type: TOGGLE_OVERLAY,
    template: html`
      <export-context-ui></export-context-ui>
    `
  })
}

export default function bootstrap() {
  import('./components/export-context-ui')

  store.dispatch({
    type: APPEND_FOOTERBAR,
    footer: {
      position: TOOL_POSITION.REAR_END,
      template: html`
        <mwc-button style="margin: auto 0;" @click="${toggleOverlayTemplate}">export</mwc-button>
      `,
      context: 'exportable'
    }
  })
}
