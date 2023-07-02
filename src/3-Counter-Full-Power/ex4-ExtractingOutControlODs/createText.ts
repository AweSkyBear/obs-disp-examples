import { obsDispEvents, payloadProp } from 'obs-disp'
import { obsDispCreator } from '../../OD'
import { IHTMLElWrapper } from '../common/ex2-AddAdditionalControls/addHtmlEl'
import { addText } from '../common/ex2-AddAdditionalControls/addText'

export const createText = obsDispCreator<{ tag?: string; name: string; text: string }>(
  ({ name, text, tag } = {} as any) => {
    const state = {
      textEl: null as IHTMLElWrapper,
    }

    return {
      [obsDispEvents.OBS_CREATE]: () => {
        state.textEl = addText({ tag, text, attrs: { class: name } })
      },
      EL_SET_TEXT: (ev) => {
        const controlName = payloadProp('name')(ev).toString()
        controlName === name && state.textEl.setText(payloadProp('text')(ev))
      },
      [obsDispEvents.OBS_REMOVE]: () => {
        state.textEl.remove()
      },
    }
  }
)
