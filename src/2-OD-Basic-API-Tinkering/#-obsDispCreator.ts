import { obsDispEvents } from 'obs-disp'
import { obsDispCreator, dispatchEvent } from '../OD'

/**
 * Showcase: creating observer creator functions, then using those to create observers (obsDispCreator API)
 */
const runExample = () => {
  //// create the observers!
  createHelloWorld1()
  createHelloWorld2()
  createHelloWorld3()

  //// 3 times
  dispatchEvent('MY_EVENT')
  dispatchEvent('MY_EVENT')
  dispatchEvent('MY_EVENT')
  ////
}

export default runExample

// stateless - accept plain object definition
const createHelloWorld1 = obsDispCreator(
  {
    MY_EVENT: () => console.log('(OBS 1:: singleton inlined obs handles MY_EVENT'),
  },
  { id: 'hello-world-1' }
)

// stateful - accept a function (which has scope, which can define variables such as `state`)
const createHelloWorld2 = obsDispCreator(
  () => {
    const state = { count: 0 }

    return {
      MY_EVENT: () => {
        state.count++
        console.log(
          '(OBS 2:: singleton inlined obs with state - handles MY_EVENT, state.count is',
          state.count
        )
      },
    }
  },
  { id: 'hello-world-2' }
)

// stateful, non-singleton (no ID provided, thus can create multiple instances of it... if you returned this from a function)
const createHelloWorld3 = obsDispCreator(() => {
  const state = { count: 0 }

  return {
    MY_EVENT: () => {
      state.count++
      console.log(
        '(OBS 3:: non-singleton inlined obs with state - handles MY_EVENT, state.count is',
        state.count
      )
    },
  }
})
