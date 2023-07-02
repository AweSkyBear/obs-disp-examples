import { IEvent, constructEvents, obsDispEvents, payloadProp } from 'obs-disp'
import { obsDispCreator, dispatchEvent, removeObsById, addObsDisp } from '../OD'
import { clone } from 'obs-disp/dist/func'

/**
 * Showcase: continuing from the EventPayload (Calculator) example - let's have nicer, typed events!
 * Use the `constructEvents` helper
 */
const runExample = () => {
  createCalculator()

  // track the calculator from outside
  addObsDisp({
    [calculatorEvents.CALCULATOR_OPERATION_RESULT]: (ev) => {
      console.log('Operation Result Handled Outside of Calculator: ', ev)
    },
    [calculatorEvents.CALCULATOR_HISTORY_SENT]: (ev) => {
      console.log('Calculator History: ', ev)
    },
  })

  // trigger some calculations
  dispatchEvent(calculatorEvents.CALCULATOR_OPERATION_EXEC, {
    payload: { op: 'add', operands: [3, 5] },
  })
  dispatchEvent(calculatorEvents.CALCULATOR_OPERATION_EXEC, {
    payload: { op: 'multiply', operands: [2, 5] },
  })
  dispatchEvent(calculatorEvents.CALCULATOR_OPERATION_EXEC, {
    payload: { op: 'divide', operands: [1, 15] },
  })
  dispatchEvent(calculatorEvents.CALCULATOR_OPERATION_EXEC, {
    payload: { op: 'subtract', operands: [1, 15] },
  })

  // request the history
  dispatchEvent(calculatorEvents.CALCULATOR_HISTORY_REQUEST)
}

export default runExample

type TCalcOperation = 'add' | 'subtract' | 'divide' | 'multiply'

type TCalculatorEventName =
  | 'CALCULATOR_OPERATION_EXEC'
  | 'CALCULATOR_OPERATION_RESULT'
  | 'CALCULATOR_HISTORY_REQUEST'
  | 'CALCULATOR_HISTORY_SENT'

export interface ICalculatorEvent extends IEvent {
  name: TCalculatorEventName
}

export const calculatorEvents = constructEvents<TCalculatorEventName>([
  'CALCULATOR_OPERATION_EXEC',
  'CALCULATOR_OPERATION_RESULT',
  'CALCULATOR_HISTORY_REQUEST',
  'CALCULATOR_HISTORY_SENT',
])

const createCalculator = obsDispCreator(
  () => {
    const state = {
      lastResult: null as number,
      lastAction: null as TCalcOperation,
      history: [] as Array<{ op: TCalcOperation; operands: [number, number]; res: number }>,
    }

    return {
      [obsDispEvents.OBS_CREATE]: () => {
        console.log('Calculator created')
      },
      [calculatorEvents.CALCULATOR_OPERATION_EXEC]: (ev) => {
        const op = payloadProp<TCalcOperation>('op')(ev)
        const [left, right] = payloadProp<[number, number]>('operands')(ev)

        state.lastResult = null

        switch (op) {
          case 'add':
            state.lastResult = left + right
            break
          case 'divide':
            state.lastResult = left / right
            break
          case 'subtract':
            state.lastResult = left - right
            break
          case 'multiply':
            state.lastResult = left * right
            break
        }

        if (state.lastResult === null || isNaN(state.lastResult)) {
          throw new Error(`Could not calc expression for op ${op} and operands: ${left}, ${right}`)
        }

        const operationWithResult = {
          op,
          operands: [left, right] as [number, number],
          res: state.lastResult,
        }
        state.history.push(operationWithResult)

        dispatchEvent(calculatorEvents.CALCULATOR_OPERATION_RESULT, {
          payload: { res: clone(operationWithResult) },
        })
      },
      [calculatorEvents.CALCULATOR_HISTORY_REQUEST]: () => {
        dispatchEvent(calculatorEvents.CALCULATOR_HISTORY_SENT, {
          payload: { history: clone(state.history) },
        })
      },
    }
  },
  { id: 'calculator' }
)
