import { obsDispEvents, payloadProp } from 'obs-disp'
import { obsDispCreator } from '../../OD'
import { IHTMLElWrapper } from '../common/ex2-AddAdditionalControls/addHtmlEl'
import { addNewLine } from '../common/ex2-AddAdditionalControls/addNewLine'

export const createNewLine = obsDispCreator<{ attachTo?: IHTMLElWrapper }>(
  ({ attachTo } = {} as any) => {
    const state = {
      brEl: null as IHTMLElWrapper,
    }

    return {
      [obsDispEvents.OBS_CREATE]: () => {
        state.brEl = addNewLine({ attachTo: attachTo.el })
      },
      [obsDispEvents.OBS_REMOVE]: () => {
        state.brEl.remove()
      },
    }
  }
)
