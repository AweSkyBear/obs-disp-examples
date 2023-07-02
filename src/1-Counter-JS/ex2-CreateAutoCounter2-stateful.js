import { obsDispEvents } from 'obs-disp'
import { dispatchEvent, obsDispCreator } from '../OD'
import CounterText from './CounterText'

/**
 * Showcase: a stateful observer (preferred for new code-bases)
 * Example bonus: inline-comments included
 *
 * Stateful is not exactly what it sounds.
 * `Stateful` means that anything that the obs-disp (instance) works with (its local
 * state is encapsulated *inside* of it)
 *
 * Instead of returning a plain object with event handlers, return
 * a function and define anything local there, not outside. Nifty, yeah?
 *
 * Effects from this:
 *
 * 1: Purity - creating and destroying the observer multiple times is OK
 *
 *  Note: expicitly passing `id` we make the observer a singleton. Running
 *  the `createAutoCounter` function multiple times (while this obs exists) will not do anything.
 *
 *  Still, we can remove a singleton OD (try removeObsById('counter'))
 *  The `[obsDispEvents.OBS_REMOVE]` takes care of the cleaning
 *
 * 2: Componentization - this is no longer just an `observer`
 *
 *  It is also a decoupled component, which we can in theory
 *    - export as a separate entity (even a lib, if you will!)
 *    - use as a child component (OD) of another OD (usecases - later)
 *    - nothing stops us from passing a param to the `createAutoCounter` to further
 * configure it!
 */
// create a wrapper function that creates our OD (obs-disp, observer, obs or oddie)

export const createAutoCounter = obsDispCreator(
  () => {
    ///// SCOPE STARTS HERE: local state/variables for this observer

    // local state: anything that your OD changes or works with
    const state = {
      count: 0,
      interval: null,
      tickMs: 1000,
    }

    //// SCOPE ENDS HERE (not counting the returned map, which also
    // has access to everything in `state`)

    // return a map of [EVENT_NAME: handler()]
    return {
      [obsDispEvents.OBS_CREATE]: () => {
        CounterText.create()
        state.interval = setInterval(() => {
          // dispatch an event globally;
          // by default, dispatches to everyone, including self
          dispatchEvent('COUNTER_ADD')
        }, state.tickMs)

        CounterText.setValue(state.count)
      },
      // custom event
      // any other OD can listen to this
      COUNTER_ADD: () => {
        state.count++
        CounterText.setValue(state.count)
      },
      [obsDispEvents.OBS_REMOVE]: () => {
        clearInterval(state.interval)
        CounterText.destroy()
      },
    }
  },
  //// specifying `id` makes sure we can have only one instance\
  // of this observer (effecitevly turning it into a singleton)
  { id: 'counter', name: 'stateful-counter' }
)

const runExample = () => {
  createAutoCounter()
}

export default runExample
