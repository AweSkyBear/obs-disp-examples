import { obsDispEvents } from 'obs-disp'
import { obsDispCreator, dispatchEvent, removeObs, removeObsById, getObsById } from '../OD'

/**
 * Showcase: creating a Singleton observer
 */
const runExample = () => {
  createApp() // creates the `app` observer

  setTimeout(() => {
    console.log('Remove app obs')
    removeObsById('app')
  })

  /* // it is identical to removing it by reference
    const appObs = createApp()
    removeObs(appObs)
  */
}

export default runExample

// stateless - accept plain object definition
const createApp = obsDispCreator(
  {
    [obsDispEvents.OBS_CREATE]: () => {
      console.log('App obs created')
    },
    [obsDispEvents.OBS_REMOVE]: () => {
      console.log('App obs is removed')
    },
  },
  { id: 'app' }
)
