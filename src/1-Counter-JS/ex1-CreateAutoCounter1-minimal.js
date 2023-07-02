import { dispatchEvent, obsDispCreator } from '../OD'
import CounterText from './CounterText'

/**
 * Showcase: the most basic OD that can exist - stateless
 *
 * Pointless example of a stateless observer, which
 * auto-creates and updates a counter every second
 */
export const createAutoCounter = obsDispCreator(
  {
    OBS_CREATE: () => {
      CounterText.create()
      CounterText.setValue(0)

      setTimeout(() => dispatchEvent('COUNTER_ADD'), 1000)
    },
    COUNTER_ADD: () => {
      CounterText.setValue(CounterText.getValue() + 1)

      setTimeout(() => dispatchEvent('COUNTER_ADD'), 1000)
    },
    OBS_REMOVE: () => {
      CounterText.destroy()
    },
  },
  { id: 'counter', name: 'stateless-counter' }
)

const runExample = () => {
  createAutoCounter()
}

export default runExample
