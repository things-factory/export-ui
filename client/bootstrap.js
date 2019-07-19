import { html } from 'lit-html'

import '@material/mwc-button'

import { store } from '@things-factory/shell'
import { openOverlay, TOOL_POSITION } from '@things-factory/layout-base'
import { APPEND_CONTEXT_TOOL } from '@things-factory/context-base'

function openContextToolbarOverlay() {
  openOverlay('context-toolbar-overlay', {
    template: html`
      <export-context-ui></export-context-ui>
    `
  })
}

export default function bootstrap() {
  import('./components/export-context-ui')

  store.dispatch({
    type: APPEND_CONTEXT_TOOL,
    tool: {
      position: TOOL_POSITION.REAR_END,
      template: html`
        <mwc-button style="margin: auto 0;" @click="${openContextToolbarOverlay}">export</mwc-button>
      `,
      context: 'exportable'
    }
  })
}
