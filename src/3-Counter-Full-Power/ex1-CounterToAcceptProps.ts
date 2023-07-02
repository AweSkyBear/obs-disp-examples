import { obsDispEvents, payloadProp } from 'obs-disp'
import CounterText from '../1-Counter-JS/CounterText'
import { IHTMLElWrapper } from './common/ex2-AddAdditionalControls/addHtmlEl'
import { addText } from './common/ex2-AddAdditionalControls/addText'
import { dispatchEvent, obsDispCreator } from '../OD'

/**
 * Showcase:
 *
 * 1) passing initial props to the Counter! TS-friendly!
 * 2) using an `addText` helper to show the initial props
 *
 * A tip - follow the Counter examples from the 1st to last
 */
export const createAutoCounter = obsDispCreator<{ initialCount: number; tickMs: number }>(
  ({ initialCount, tickMs }) => {
    const state = {
      count: initialCount || 0,
      interval: null as NodeJS.Timer,
      tickMs: tickMs || 1000,
      textTickMs: null as IHTMLElWrapper,
      textStartCount: null as IHTMLElWrapper,
    }

    return {
      [obsDispEvents.OBS_CREATE]: () => {
        CounterText.create()
        state.interval = setInterval(() => {
          dispatchEvent('COUNTER_INCREASE')
        }, state.tickMs)

        CounterText.setValue(state.count)

        state.textTickMs = addText({ text: `Updates every ${state.tickMs / 1000}s` })
        state.textStartCount = addText({ text: `Starts from ${initialCount}` })
      },
      COUNTER_INCREASE: () => {
        state.count++
        CounterText.setValue(state.count)
      },
      [obsDispEvents.OBS_REMOVE]: () => {
        clearInterval(state.interval)
        CounterText.destroy()
        state.textTickMs.remove()
        state.textStartCount.remove()
      },
    }
  },
  { id: 'counter' }
)

const runExample = () => {
  createAutoCounter({ initialCount: 42, tickMs: 700 })
  // createAutoCounter2()
  // createAutoCounter2()
  // createAutoCounter2()
  // createAutoCounter2()
}

export default runExample
