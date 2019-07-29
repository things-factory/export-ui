import { html } from 'lit-html'

import '@material/mwc-icon'

import { store } from '@things-factory/shell'
import { openOverlay, TOOL_POSITION } from '@things-factory/layout-base'
import { APPEND_CONTEXT_TOOL } from '@things-factory/context-base'

import './templates/export-overlay-template'

export default function bootstrap() {
  function openContextToolbarOverlay() {
    openOverlay('context-toolbar-overlay', {
      template: html`
        <export-overlay-template></export-overlay-template>
      `
    })
  }

  store.dispatch({
    type: APPEND_CONTEXT_TOOL,
    tool: {
      position: TOOL_POSITION.FRONT,
      template: html`
        <mwc-icon @click="${openContextToolbarOverlay}">save_alt</mwc-icon>
      `,
      context: 'exportable'
    }
  })
}
