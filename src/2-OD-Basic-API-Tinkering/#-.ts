import { obsDispEvents } from 'obs-disp'
import { obsDispCreator, dispatchEvent, removeObs, removeObsById } from '../OD'

/**
 * Showcase: creating a Singleton observer
 */
const runExample = () => {
  createApp() // creates the `app` observer

  // trying to create it again will not trigger any logic
  createApp()
  createApp()

  // removing it and adding it will work
  removeObsById('app')

  createApp() // creates the `app` observers
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
