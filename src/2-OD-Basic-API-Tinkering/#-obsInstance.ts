import { ObsDispCreate, obsDispEvents } from 'obs-disp'
import { addObsDisp } from '../OD'

/**
 * Showcase: getting the observer instance (sometimes we need it)
 * 2 ways:
 * - directly from the payload,
 * - or using the helper `ObsDispCreate.useObs` helper (only for the OBS_CREATE event)
 */
const runExample = () => {
  addObsDisp(
    {
      [obsDispEvents.OBS_CREATE]: (ev) => {
        // take it from the Create event
        console.log('obs instance (obs 1): ', ev.payload.obs.instance)
      },
    },
    { id: 'hello-obs-instance-1' }
  )

  addObsDisp(
    {
      [obsDispEvents.OBS_CREATE]: ObsDispCreate.useObs((obs) => {
        console.log('obs instance (obs 2): ', obs)
      }),
    },
    { id: 'hello-obs-instance-2' }
  )
}

export default runExample
