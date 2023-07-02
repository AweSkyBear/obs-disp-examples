import { obsDispEvents, payloadProp } from 'obs-disp'
import { dispatchEvent, obsDispCreator } from '../OD'
import { createText } from './ex4-ExtractingOutControlODs/createText'
import { createButton } from './ex4-ExtractingOutControlODs/createButton'
import { createInput } from './ex4-ExtractingOutControlODs/createInput'
import { createNewLine } from './ex4-ExtractingOutControlODs/createNewLine'

/**
 * Showcase:
 *
 * 1) True componentization! A much cleaner approach.
 *      - Use 3 new observer creators: createInput, createText, createButton
 *      - We communicate with them via events and nothing else. Nice? ALL communucation goes this path.
 * 2) Note: even though we are adding the generic observers globally, we may want something a bit different
 *      - see the next example for a more generic approach
 */
export const createAutoCounter = obsDispCreator<{ startCount: number; tickMs: number }>(
  ({ startCount, tickMs }) => {
    const state = {
      count: startCount || 0,
      startCount,
      interval: null as NodeJS.Timer,
      tickMs: tickMs || 1000,
      changeAmount: 1,
      isRunning: true,
      // no need for htmlEls -> we will have separate observers now :) , created
      // via createButton, createInput, createText,
      ////   htmlEls: [] as IHTMLElWrapper[],
    }

    const _updateCounterValue = () =>
      dispatchEvent('EL_SET_TEXT', { payload: { name: 'textCounter', text: state.count } }) //findElAndSetText('textCounter', state.count)

    const _resetCounter = () => {
      state.count = parseInt(state.startCount as any) || 0
    }

    const _startCounter = () => {
      state.isRunning = true

      if (state.interval) return
      state.interval = setInterval(() => {
        dispatchEvent('COUNTER_INCREASE', { payload: { changeAmount: state.changeAmount } })
      }, state.tickMs)

      _updateIsRunningEls()
    }
    const _resumeCounter = _startCounter

    const _stopCounter = () => {
      state.isRunning = false
      clearInterval(state.interval)
      state.interval = null

      _updateIsRunningEls()
    }
    const _restartCounter = () => {
      _stopCounter()
      _startCounter()
    }
    const _updateIsRunningEls = () => {
      dispatchEvent('EL_SET_TEXT', {
        payload: { name: 'textIsRunning', text: `Is Running: ${state.isRunning}` },
      })
      dispatchEvent('EL_DISABLE', {
        payload: { name: 'btnPause', disabled: !state.isRunning },
      })
      dispatchEvent('EL_DISABLE', {
        payload: { name: 'btnResume', disabled: state.isRunning },
      })
    }

    const _getTextTickMs = () => `Updates every ${state.tickMs / 1000}s`
    const _updateTextTickMs = () => {
      dispatchEvent('EL_SET_TEXT', { payload: { name: 'textTickMs', text: _getTextTickMs() } })
    }
    const _getTextStartCount = () => `Starts from ${state.startCount}`
    const _updateTextStartCount = () => {
      dispatchEvent('EL_SET_TEXT', {
        payload: { name: 'textStartCount', text: _getTextStartCount() },
      })
    }

    return {
      [obsDispEvents.OBS_CREATE]: () => {
        createText({ tag: 'p', name: 'textCounter', text: `${startCount}` })
        createText({ name: 'textIsRunning', text: state.isRunning as any })
        createText({ name: 'textTickMs', text: _getTextTickMs() })
        createText({ name: 'textStartCount', text: _getTextStartCount() })

        createButton({ name: 'btnReset', text: 'Reset' })
        createNewLine()
        createButton({ name: 'btnPause', text: 'Pause' })
        createButton({ name: 'btnResume', text: 'Resume' })
        createNewLine()
        createInput({
          name: 'inputTickMs',
          label: 'Updates Every (ms): ',
          value: state.tickMs,
          attrs: { type: 'number', min: 0, max: 10000 },
        })
        createInput({
          name: 'inputStartValue',
          label: 'Start Value: ',
          value: state.startCount,
          attrs: { type: 'number', min: -100, max: 100 },
        })
        createInput({
          name: 'inputChangeAmount',
          label: 'Change Amount: ',
          value: state.changeAmount,
          attrs: { type: 'number', min: -1000, max: 1000 },
        })

        // note: we are initiating counting in the next tick, since created observers
        // are not instantly available (e.g. their ON_CREATE is executed the next tick)
        // TODO: -> add 'onCreated' just inside of the observers
        setTimeout(() => _startCounter())
      },
      /////////// -> Note: handling (component) observer events ///////////
      //// using EL_CLICK and EL_CHANGE events to route events to our component!
      EL_CLICK: (ev) => {
        const name = payloadProp<string>('name')(ev)
        switch (name) {
          case 'btnReset':
            dispatchEvent('COUNTER_RESET')
            break
          case 'btnPause':
            dispatchEvent('COUNTER_PAUSE')
            break
          case 'btnResume':
            dispatchEvent('COUNTER_RESUME')
            break
        }
      },
      EL_CHANGE: (ev) => {
        const name = payloadProp<string>('name')(ev)
        const value = payloadProp<string>('value')(ev)
        switch (name) {
          case 'inputTickMs':
            dispatchEvent('COUNTER_SET_TICK_MS', { payload: { tickMs: value } })
            break
          case 'inputStartValue':
            dispatchEvent('COUNTER_SET_START_VALUE', { payload: { startValue: value } })
            break
          case 'inputChangeAmount':
            dispatchEvent('COUNTER_SET_CHANGE_AMOUNT', { payload: { changeAmount: value } })
            break
        }
      },
      /////////// <- Note: handling (component) observer events ///////////
      COUNTER_PAUSE: _stopCounter,
      COUNTER_RESUME: _resumeCounter,
      COUNTER_INCREASE: (ev) => {
        const incr = payloadProp<number>('changeAmount')(ev)
        state.count += incr
        _updateCounterValue()
      },
      COUNTER_RESET: () => {
        _resetCounter()
        _updateCounterValue()
      },
      COUNTER_SET_TICK_MS: (ev) => {
        state.tickMs = parseInt(payloadProp<string>('tickMs')(ev))
        _updateTextTickMs()

        state.isRunning && dispatchEvent('COUNTER_RESTART')
      },
      COUNTER_SET_START_VALUE: (ev) => {
        state.startCount = payloadProp<number>('startValue')(ev)
        _updateTextStartCount()
      },
      COUNTER_SET_CHANGE_AMOUNT: (ev) => {
        state.changeAmount = parseInt(payloadProp<string>('changeAmount')(ev))
      },
      COUNTER_RESTART: _restartCounter,
      /**
       * To be used only when externally (via event dispatch) updating state values
       * which also have corresponding inputs
       */
      COUNTER_REFRESH_INPUTS: () => {
        dispatchEvent('EL_SET_VALUE', {
          payload: { name: 'inputChangeAmount', value: state.changeAmount },
        })
        dispatchEvent('EL_SET_VALUE', {
          payload: { name: 'inputStartValue', value: state.startCount },
        })
        dispatchEvent('EL_SET_VALUE', {
          payload: { name: 'inputTickMs', value: state.tickMs },
        })
      },
      [obsDispEvents.OBS_REMOVE]: () => {
        _stopCounter()

        // note: NO need to remove child observers manually, while this observer is removed -
        //// that is because all child observers are automatically removed when their parent is ! ! !
      },
    }
  },
  { id: 'counter' }
)

const runExample = () => {
  createAutoCounter({ startCount: 0, tickMs: 1000 })
  /*
  // Note: due to the event-driven approach, we can change
  the Counter's state from the outside too, e.g.:

  OD.dispatchEvent('COUNTER_PAUSE')
  // or
  OD.dispatchEvent('COUNTER_RESUME')
  // or
  OD.dispatchEvent('COUNTER_RESET')

  // or
  OD.dispatchEvent('COUNTER_SET_START_VALUE', { payload: { startValue: 300 } })
  OD.dispatchEvent('COUNTER_REFRESH_INPUTS')

  // or
  OD.dispatchEvent('COUNTER_SET_CHANGE_AMOUNT', { payload: { changeAmount: 25 } })
  OD.dispatchEvent('COUNTER_REFRESH_INPUTS')

  // or
  OD.dispatchEvent('COUNTER_SET_TICK_MS', { payload: { tickMs: 350 } })
  OD.dispatchEvent('COUNTER_REFRESH_INPUTS')

  */
}

export default runExample
