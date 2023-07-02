import { obsDispEvents } from 'obs-disp'
import { addObsDisp, dispatchEvent, removeObs, removeObsById } from '../OD'

/**
 * Showcase: passing `meta` field to an observer
 * This can later be used to specify a target when dispatching events.
 */
const runExample = () => {
  addObsDisp(
    {
      SOME_EVENT: () => {},
    },
    { id: 'hello-world-with-meta', meta: { a: 5 } /* <----- */, name: 'Obs with meta' }
  )
}

export default runExample
