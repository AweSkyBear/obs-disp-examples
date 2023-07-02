import { IObserver, obsDispEvents } from 'obs-disp'
import { dispatchEvent, obsDispCreator } from '../OD'
/**
 * Showcase:
 *  1) Nested child observer - adding a child observer on a child observer!: obs.addOD API
 *  2) Auto-removal of nested children when the parent is removed (removeObs())
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

const createObsLevel2 = obsDispCreator({
  [obsDispEvents.OBS_CREATE]: ({ payload }) => {
    const obs = payload.obs.instance as IObserver

    console.log('(createObsLevel2) : addOD(createObsLevel3())')
    obs.addOD(createObsLevel3())
  },
  GAME_START: ({ payload }) => {
    console.log('(createObsLevel2) GAME_START')
  },
  [obsDispEvents.OBS_REMOVE]: ({ name, payload }) => console.log('(createObsLevel2) OBS_REMOVE'),
})

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
  EVENT_FROM_PARENT: () => {
    console.log('(createSeparateObs) EVENT_FROM_PARENT')
  },
  [obsDispEvents.OBS_REMOVE]: ({ name, payload }) => console.log('(createSeparateObs) OBS_REMOVE'),
})

// adding a child obs
const runExample = () => {
  createSeparateObs()

  const obs = createObsTopLevel()

  // dispatches to both!
  dispatchEvent('GAME_START')
}

export default runExample
