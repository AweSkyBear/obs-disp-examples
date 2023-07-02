import { obsDispEvents, payloadProp } from 'obs-disp'
import { dispatchEvent, obsDispCreator } from '../../OD'
import { addBtn } from '../common/ex2-AddAdditionalControls/addBtn'
import { IHTMLElWrapper } from '../common/ex2-AddAdditionalControls/addHtmlEl'

export const createButton = obsDispCreator<{
  name: string
  text: string
}>(({ name, text }) => {
  const state = {
    btnEl: null as IHTMLElWrapper,
  }

  return {
    [obsDispEvents.OBS_CREATE]: () => {
      state.btnEl = addBtn({
        text,
        attrs: { class: name },
        onClick: () => dispatchEvent('EL_CLICK', { payload: { name } }),
      })
    },
    EL_SET_TEXT: (ev) => {
      const controlName = payloadProp('name')(ev)
      controlName === name && state.btnEl.setText(payloadProp('text')(ev))
    },
    EL_DISABLE: (ev) => {
      const controlName = payloadProp('name')(ev)
      controlName === name && state.btnEl.setDisabled(payloadProp<boolean>('disabled')(ev))
    },
    [obsDispEvents.OBS_REMOVE]: () => {
      state.btnEl.remove()
    },
  }
})
