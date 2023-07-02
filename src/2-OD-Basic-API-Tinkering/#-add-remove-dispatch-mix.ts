import { obsDispEvents } from 'obs-disp'
import { addObsDisp, dispatchEvent, removeObs, removeObsById } from '../OD'

/**
 * Showcase basic API usage and its effects:
 * 1) OD creation (stateless - a map with event handlers)
 * 2) OD removal
 * 3) Dispatching events - basic, no payload or target, just event name
 */
const runExample = () => {
  console.log('dispatchEvent GAME_START')
  dispatchEvent('GAME_START')

  console.log('const inst = addObsDisp(... { id: "hello-world" }) ')
  const inst = addObsDisp(
    {
      GAME_START: () => console.log('(inlined obs 1) GAME_START'),
      [obsDispEvents.OBS_REMOVE]: ({ name, payload }) => console.log('(inline obs) OBS_REMOVE'),
    },
    { id: 'hello-world' }
  )

  console.log('dispatchEvent GAME_START')
  dispatchEvent('GAME_START')

  console.log('(try again same ID obs): addObsDisp(... { id: "hello-world" }) ')
  addObsDisp({ GAME_START: () => console.log('(inlined obs 2) GAME_START') }, { id: 'hello-world' })

  console.log('addObsDisp(... { id: "hello-world-2" }) ')
  // try add another observer
  addObsDisp(
    { GAME_START: () => console.log('(inlined obs 1) GAME_START') },
    { id: 'hello-world-2' }
  )

  console.log('dispatchEvent GAME_START')
  dispatchEvent('GAME_START')

  // remove it by ref (rare use?):
  // console.log('(removing observer by reference): removeObs(inst);')
  removeObs(inst)

  // dispatch an event again - no HORRRAY called
  console.log('dispatchEvent GAME_START')
  dispatchEvent('GAME_START')

  // remove it by id:
  console.log('removeObsById("hello-world-2")')
  removeObsById('hello-world-2')

  // dispatch an event again - no HORRRAY 2 called
  console.log('dispatchEvent GAME_START')
  dispatchEvent('GAME_START')

  // add one last obs to tinker with
  addObsDisp({ GAME_START: () => console.log('HORRRAY 3') }, { id: 'hello-world-3' })

  console.log(
    `Now test on your own in the F12 dev tools - use the OD.* APIs;
      e.g. try to dispatch an event and see what happens: OD.dispatchEvent("GAME_START")`
  )
}

export default runExample
