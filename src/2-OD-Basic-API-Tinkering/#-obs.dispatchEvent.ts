import { IObserver, obsDispEvents } from 'obs-disp'
import { dispatchEvent, obsDispCreator, getObsById } from '../OD'

/**
 * Showcase:
 * 1) dispatching event from a child observer: obs.dispatchEvent()
 * 2) the dispatched event is constrained to only the observers in that tree!
 */
const createObsTopLevel = obsDispCreator({
  [obsDispEvents.OBS_CREATE]: ({ payload }) => {
    console.log('(createParentObs) OBS_CREATE')
    const obs = payload.obs.instance as IObserver

    obs.addOD(createObsLevel2())
  },
  GAME_START: () => console.log('(createObsTopLevel) GAME_START'),
  [obsDispEvents.OBS_REMOVE]: ({ name, payload }) => console.log('(createObsTopLevel) OBS_REMOVE'),
})

const createObsLevel2 = obsDispCreator(
  {
    [obsDispEvents.OBS_CREATE]: ({ payload }) => {
      const obs = payload.obs.instance as IObserver

      console.log('(createObsLevel2) : addOD(createObsLevel3())')
      obs.addOD(createObsLevel3())
    },
    GAME_START: ({ payload }) => {
      console.log('(createObsLevel2) GAME_START')
    },
    [obsDispEvents.OBS_REMOVE]: ({ name, payload }) => console.log('(createObsLevel2) OBS_REMOVE'),
  },
  {
    id: 'createObsLevel2',
  }
)

const createObsLevel3 = obsDispCreator({
  OBS_CREATE: () => {
    console.log('(createObsLevel3) OBS_CREATE')
  },
  GAME_START: () => console.log('(createObsLevel3) GAME_START'),
  [obsDispEvents.OBS_REMOVE]: ({ name, payload }) => console.log('(createObsLevel3) OBS_REMOVE'),
})

const createSeparateObs = obsDispCreator({
  OBS_CREATE: ({ payload }) => {
    console.log('(createSeparateObs) OBS_CREATE')
  },
  GAME_START: () => {
    console.log('(createSeparateObs) GAME_START')
  },
  EVENT_FROM_PARENT: () => {
    console.log('(createSeparateObs) EVENT_FROM_PARENT')
  },
  [obsDispEvents.OBS_REMOVE]: ({ name, payload }) => console.log('(createSeparateObs) OBS_REMOVE'),
})

// adding a child obs
const runExample = () => {
  createSeparateObs()

  const obs = createObsTopLevel()
  obs.dispatchEvent('GAME_START') // this will not trigger event in obs from createSeparateObs()

  setTimeout(() => {
    getObsById('createObsLevel2').dispatchEvent('GAME_START') // again, events contained only in the tree
  })
}

export default runExample
