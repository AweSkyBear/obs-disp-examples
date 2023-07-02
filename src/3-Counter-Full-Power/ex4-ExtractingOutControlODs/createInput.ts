import { obsDispEvents, payloadProp } from 'obs-disp'
import { dispatchEvent, obsDispCreator } from '../../OD'
import { IHTMLElWrapper } from '../common/ex2-AddAdditionalControls/addHtmlEl'
import { addInput } from '../common/ex2-AddAdditionalControls/addInput'

export const createInput = obsDispCreator<{
  name: string
  label?: string
  value: any
  attrs?: Record<string, unknown>
}>(({ name, label, value, attrs }) => {
  const state = {
    inputEl: null as IHTMLElWrapper<HTMLInputElement>,
  }

  return {
    [obsDispEvents.OBS_CREATE]: () => {
      state.inputEl = addInput({
        value: `${value}`,
        label,
        attrs: { ...attrs, class: name },
        onChange: (ev) =>
          dispatchEvent('EL_CHANGE', { payload: { name, value: (ev as any).target.value } }),
      })
    },
    EL_SET_VALUE: (ev) => {
      const controlName = payloadProp('name')(ev)
      controlName === name && state.inputEl.setValue(payloadProp('value')(ev))
    },
    EL_DISABLE: (ev) => {
      const controlName = payloadProp('name')(ev)
      controlName === name && state.inputEl.setDisabled(payloadProp<boolean>('disabled')(ev))
    },
    [obsDispEvents.OBS_REMOVE]: () => {
      state.inputEl.remove()
    },
  }
})
