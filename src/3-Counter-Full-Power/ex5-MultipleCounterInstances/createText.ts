import { ObsDispCreate, IObserver, obsDispEvents, payloadProp } from 'obs-disp'
import { obsDispCreator } from '../../OD'
import { IHTMLElWrapper } from '../common/ex2-AddAdditionalControls/addHtmlEl'
import { addText } from '../common/ex2-AddAdditionalControls/addText'

export const createText = obsDispCreator<{
  tag?: string
  name: string
  text: string
  attachTo?: IHTMLElWrapper
}>(({ tag, name, text, attachTo } = {} as any) => {
  const state = {
    textEl: null as IHTMLElWrapper,
  }
  let _obs: IObserver = null

  return {
    [obsDispEvents.OBS_CREATE]: ObsDispCreate.useObs((obs) => {
      _obs = obs
      state.textEl = addText({ tag, text, attrs: { class: name }, attachTo: attachTo.el })
    }),
    EL_SET_TEXT: (ev) => {
      const controlName = payloadProp('name')(ev).toString()
      controlName === name && state.textEl.setText(payloadProp('text')(ev))
    },
    [obsDispEvents.OBS_REMOVE]: () => {
      state.textEl.remove()
    },
  }
})
