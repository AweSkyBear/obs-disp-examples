import { obsDispEvents, payloadProp, IObserver, ObsDispCreate } from 'obs-disp'
import { obsDispCreator, dispatchEvent } from '../OD'
import { createText } from './ex5-MultipleCounterInstances/createText'
import { createButton } from './ex5-MultipleCounterInstances/createButton'
import { createNewLine } from './ex5-MultipleCounterInstances/createNewLine'
import { addHtmlEl, IHTMLElWrapper } from './common/ex2-AddAdditionalControls/addHtmlEl'
import { createAutoCounter } from './ex5-MultipleCounterInstances'

/**
 * Showcase: Master Counter Controller / affect all existing counter instances:
 * Reset All  |   Pause All   |  Resume All
 *
 * NB: this example was done literally in 3 minutes; it shows the power of evented architecture
 */
export const createMasterOfCounters = obsDispCreator(() => {
  const state = {
    obs: null as IObserver,
    containerEl: null as IHTMLElWrapper,
  }

  return {
    [obsDispEvents.OBS_CREATE]: ObsDispCreate.useObs((obs) => {
      state.obs = obs
      state.containerEl = addHtmlEl({ attrs: { class: 'master-of-counters' } })
      const el = state.containerEl

      state.obs.addOD(createButton({ name: 'btnResetAll', text: 'Reset All', attachTo: el }))
      state.obs.addOD(createButton({ name: 'btnPauseAll', text: 'Pause All', attachTo: el }))
      state.obs.addOD(createButton({ name: 'btnResumeAll', text: 'Resume All', attachTo: el }))
    }),
    /////////// -> Note: handling (component) observer events ///////////
    //// using EL_CLICK and EL_CHANGE events to route events to our component!
    EL_CLICK: (ev) => {
      const name = payloadProp<string>('name')(ev)
      switch (name) {
        case 'btnResetAll':
          // dispatch it globally, so that all existing observers would receive this
          dispatchEvent('COUNTER_RESET')
          break
        case 'btnPauseAll':
          dispatchEvent('COUNTER_PAUSE')
          break
        case 'btnResumeAll':
          dispatchEvent('COUNTER_RESUME')
          break
      }
    },
  }
})

const runExample = () => {
  createMasterOfCounters()

  Array.from(Array(5)).forEach((_, ind) =>
    createAutoCounter({ startCount: Math.pow(10, ind), tickMs: 1000 })
  )
}

export default runExample
