import { addObsDisp, dispatchEvent, removeObs, removeObsById } from '../OD'

/**
 * Showcase: adding "inlined" observers (addObsDisp API)
 */
const runExample = () => {
  // stateless - accept plain object definition
  addObsDisp(
    {
      MY_EVENT: () => console.log('(OBS 1:: singleton inlined obs handles MY_EVENT'),
    },
    { id: 'hello-world-addObsDisp-1' }
  )

  // stateful - accept a function (which has scope, which can define variables such as `state`)
  addObsDisp(
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
    { id: 'hello-world-addObsDisp-2' }
  )

  // stateful, non-singleton (no ID provided, thus can create multiple instances of it... if you returned this from a function)
  addObsDisp(() => {
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

  //// 3 times
  dispatchEvent('MY_EVENT')
  dispatchEvent('MY_EVENT')
  dispatchEvent('MY_EVENT')
  ////
}

export default runExample
