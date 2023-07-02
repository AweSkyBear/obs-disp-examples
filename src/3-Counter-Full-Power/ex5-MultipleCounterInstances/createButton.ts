import { ObsDispCreate, IObserver, obsDispEvents, payloadProp } from 'obs-disp'
import { obsDispCreator } from '../../OD'
import { addBtn } from '../common/ex2-AddAdditionalControls/addBtn'
import { IHTMLElWrapper } from '../common/ex2-AddAdditionalControls/addHtmlEl'

export const createButton = obsDispCreator<{
  name: string
  text: string
  attachTo?: IHTMLElWrapper
}>(({ name, text, attachTo } = {} as any) => {
  const state = {
    obs: null as IObserver,
    btnEl: null as IHTMLElWrapper,
  }

  return {
    [obsDispEvents.OBS_CREATE]: ObsDispCreate.useObs((obs) => {
      state.obs = obs
      state.btnEl = addBtn({
        text,
        attrs: { class: name },
        attachTo: attachTo.el,
        // TODO: CHANGE IN FRAMEWORK ! -> IF THIS HAS NO ACTIVE PARENT when obs.dispatchEvent() -> DISPATCH TO ALL !!!
        onClick: () => obs.dispatchEvent('EL_CLICK', { payload: { name } }),
      })
    }),
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
