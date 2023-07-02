import { obsDispEvents } from 'obs-disp'
import { addObsDisp, dispatchEvent, removeObs, removeObsById } from '../OD'

const runExample = () => {
  addObsDisp(
    {
      SAY_HELLO: () => console.log('SAY_HELLO from First Hello'),
    },
    { id: 'hello-1', name: 'First Hello', meta: { a: 5 } }
  )

  addObsDisp(
    {
      SAY_HELLO: () => console.log('SAY_HELLO from Second Hello'),
    },
    { id: 'hello-2', name: 'Second Hello', meta: { a: 10 } }
  )

  dispatchEvent('SAY_HELLO', {
    target: (obs) => {
      return (obs.meta?.a as number) < 8
    },
  })
}

export default runExample
