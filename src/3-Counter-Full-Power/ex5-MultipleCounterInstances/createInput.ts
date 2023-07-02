import { ObsDispCreate, IObserver, obsDispEvents, payloadProp } from 'obs-disp'
import { IHTMLElWrapper } from '../common/ex2-AddAdditionalControls/addHtmlEl'
import { addInput } from '../common/ex2-AddAdditionalControls/addInput'
import { obsDispCreator } from '../../OD'

export const createInput = obsDispCreator<{
  name: string
  label?: string
  value: any
  attachTo?: IHTMLElWrapper
  attrs?: Record<string, unknown>
}>(({ name, label, value, attrs, attachTo } = {} as any) => {
  const state = {
    obs: null as IObserver,
    inputEl: null as IHTMLElWrapper<HTMLInputElement>,
  }

  return {
    [obsDispEvents.OBS_CREATE]: ObsDispCreate.useObs((obs) => {
      state.obs = obs

      state.inputEl = addInput({
        value: `${value}`,
        label,
        attrs: { ...attrs, class: name },
        attachTo: attachTo.el,
        // TODO: CHANGE IN FRAMEWORK ! -> IF THIS HAS NO ACTIVE PARENT when obs.dispatchEvent() -> DISPATCH TO ALL !!!
        onChange: (ev) =>
          obs.dispatchEvent('EL_CHANGE', { payload: { name, value: (ev as any).target.value } }),
      })
    }),
    EL_SET_VALUE: (ev) => {
      const controlName = payloadProp('name')(ev)
      if (controlName === name) {
        const v = payloadProp('value')(ev)
        state.inputEl.setValue(v)
        state.obs.dispatchEvent('EL_VALUE_UPDATED', { payload: { name, value: v } })
      }
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
