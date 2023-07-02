import { obsDispEvents } from 'obs-disp'
import { obsDispCreator, dispatchEvent, removeObs, removeObsById, getObsById } from '../OD'

/**
 * Showcase: creating a Singleton observer
 */
const runExample = () => {
  createApp() // creates the `app` observer

  setTimeout(() => {
    console.log('App obs: ', getObsById('app'))
  })
}

export default runExample

// stateless - accept plain object definition
const createApp = obsDispCreator(
  {
    [obsDispEvents.OBS_CREATE]: () => {
      console.log('App obs created')
    },
  },
  { id: 'app' }
)
