import { IObserver, obsDispEvents, ObsDispCreate, pipe, Ev } from 'obs-disp'
import { obsDispCreator, removeObs } from '../OD'

/**
 * Showcase:
 *  1) Adding a child observer: obs.addOD API
 *  2) Event dispatch from an observer instance
 *    - the event is not dispatched to 'outsider scope' (createSeparateObs)
 *  3) Auto-removal of the child when the parent is removed
 *    - removing a parent with children (will by default, if target is not passed)
 *      remove all children down the tree
 *  4) Using an event handler helper (ObsDispCreate.useObs, Ev.useEvent)
 *    - extract something from the event handler
 *    - composable
 */
const createParentObs = obsDispCreator(
  {
    // note 1: we can use a helper: useObs (which extracts the observer from the event payload)
    // coming from ObsDispCreate.<handlers>
    // note 2: we can even `pipe` or `compose` the event, since useObs() returns the event
    // and is composable : )
    [obsDispEvents.OBS_CREATE]: pipe(
      ObsDispCreate.useObs((obs) => {
        console.log('(createParentObs) here is the obs', obs)
      }),
      ObsDispCreate.useObs((obs) => {
        console.log('(createParentObs) OBS_CREATE')
        obs.addOD(createChildObs())
        console.log('(createParentObs) obs.addOD createChildObs()')
      }),
      Ev.useEvent((ev) => {
        console.log('(createParentObs) the event object is: ', ev)
      })
    ),
    // or this can be done verbously, without the `useObs` helper:
    // [obsDispEvents.OBS_CREATE]: ({ payload }) => {
    //   const obs = payload.obs.instance as IObserver

    //   console.log('here is the obs', obs)
    //   console.log('(createParentObs) OBS_CREATE')

    //   obs.addOD(createChildObs())
    //   console.log('(createParentObs) obs.addOD createChildObs()')
    // },
    EVENT_FROM_PARENT: () => {
      console.log('(createParentObs) EVENT_FROM_PARENT')
    },
    [obsDispEvents.OBS_REMOVE]: ({ name, payload }) => console.log('(createParentObs) OBS_REMOVE'),
  },
  { name: 'the-parent' }
)

const createChildObs = obsDispCreator(
  {
    [obsDispEvents.OBS_CREATE]: ({ payload }) => {
      const obs = payload.obs.instance as IObserver
      console.log('(createChildObs) OBS_CREATE')
      /// Note: this event will be dispatched ONLY in the scope of the top-level parent!
      /// - to the top-level parent itself AND to all of its children
      /// - this will not be dispatched to separate trees (like createSeparateObs())
      obs.dispatchEvent('EVENT_FROM_PARENT')
    },
    EVENT_FROM_PARENT: () => {
      console.log('(createChildObs) EVENT_FROM_PARENT')
    },
    [obsDispEvents.OBS_REMOVE]: ({ name, payload }) => console.log('(createChildObs) OBS_REMOVE'),
  },
  { name: 'the-child' }
)

const createSeparateObs = obsDispCreator(
  {
    [obsDispEvents.OBS_CREATE]: ({ payload }) => {
      console.log('(createSeparateObs) OBS_CREATE')
    },
    EVENT_FROM_PARENT: () => {
      console.log('(createSeparateObs) EVENT_FROM_PARENT')
    },
    [obsDispEvents.OBS_REMOVE]: ({ name, payload }) =>
      console.log('(createSeparateObs) OBS_REMOVE'),
  },
  { name: 'the-separate-obs' }
)

const runExample = () => {
  createSeparateObs()

  const parentObs = createParentObs()

  setTimeout(() => {
    console.log('Will now REMOVE the-parent - auto-removes children')
    removeObs(parentObs)
  }, 1000)
}

export default runExample
