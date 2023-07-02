import { obsDispEvents } from 'obs-disp'
import { obsDispCreator } from '../OD'

/**
 * Showcase: passing creation params to `app`
 * -- pass them as the first argument to `createApp` (the result function from `obsDispCreator)
 * -- receive them inside
 */
const runExample = () => {
  createApp({ config: { key1: 'config-key', key2: 42 } }) // creates the `app` observer with initial params
}

export default runExample

// stateless - accept plain object definition
const createApp = obsDispCreator<{ config: { key1: string; key2: number } }>(
  (params) => {
    const state = {
      config: params,
    }

    return {
      [obsDispEvents.OBS_CREATE]: () => {
        console.log('App obs created, initial config: ', state.config)
      },
    }
  },
  {
    id: 'app',
  }
)
