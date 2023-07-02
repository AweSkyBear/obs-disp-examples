import { ObsDispCreate, obsDispEvents } from 'obs-disp'
import { addObsDisp, dispatchEvent, obsDispCreator } from '../OD'

/**
 * Showcase: adding a child observer
 *
 * This has several advantages:
 * - if we dispatch an event from the observer instance, by default the event is contained
 * inside of the current observer tree (only children, parents of and the observer itself receive it)
 * - if we remove a given observer, all its children are also automatically removed
 */
const runExample = () => {
  addObsDisp(
    {
      [obsDispEvents.OBS_CREATE]: ObsDispCreate.useObs((obs) => {
        console.log('obs instance (obs 2): ', obs)

        // add a child observer (create it inlined with `addObsDisp`)
        obs.addOD(
          addObsDisp({
            CHILD_OBS_EVENT: () => console.log('child obs event'),
          })
        )

        // add a child observer from a creator function
        obs.addOD(createSomeObs())
      }),
    },
    { id: 'hello-obs-with-children' }
  )

  addObsDisp({
    [obsDispEvents.OBS_CREATE]: () => {
      dispatchEvent('CHILD_OBS_EVENT')
    },
  })

  /// adding a child observer from `create
}

export default runExample

const createSomeObs = obsDispCreator(() => {
  return {
    [obsDispEvents.OBS_CREATE]: () => console.log('obs-created'),
  }
})
