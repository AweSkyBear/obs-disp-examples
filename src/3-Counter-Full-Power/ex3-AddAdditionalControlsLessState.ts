import { obsDispEvents, payloadProp } from 'obs-disp'
import { dispatchEvent, obsDispCreator } from '../OD'
import { addBtn } from './common/ex2-AddAdditionalControls/addBtn'
import { IHTMLElWrapper } from './common/ex2-AddAdditionalControls/addHtmlEl'
import { addInput } from './common/ex2-AddAdditionalControls/addInput'
import { addNewLine } from './common/ex2-AddAdditionalControls/addNewLine'
import { addText } from './common/ex2-AddAdditionalControls/addText'
import { findEl } from './common/ex2-AddAdditionalControls/findEl'
import { setElDisabled } from './common/ex2-AddAdditionalControls/setElDisabled'
import { setElValue } from './common/ex2-AddAdditionalControls/setElValue'
import { setElText } from './common/ex2-AddAdditionalControls/setElText'

const findElAndSetValue = (className: string, v: any) => setElValue(findEl(className), v)
const findElAndSetDisabled = (className: string, disabled: boolean) =>
  setElDisabled(findEl(className), disabled)
const findElAndSetText = (className: string, text: any) => setElText(findEl(className), text)

/**
 * Showcase:
 *
 * 1) LESS state - when we can, we may want to *find things on the go*, like html elements
 *    - we add attributes to the html elements and then find them on the fly
 *    - this makes for a more clutter-free code and less state
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
      // keeping them here, just for cleaning purposes in OBS_REMOVE
      htmlEls: [] as IHTMLElWrapper[],
    }

    const _updateCounterValue = () => findElAndSetText('textCounter', state.count)
    const _resetCounter = () => {
      state.count = state.startCount || 0
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
      findElAndSetText('textIsRunning', `Is Running: ${state.isRunning}`)
      findElAndSetDisabled('btnPause', state.isRunning)
      findElAndSetDisabled('btnResume', !state.isRunning)
    }

    const _updateTextTickMs = () => {
      findElAndSetText('textTickMs', `Updates every ${state.tickMs / 1000}s`)
    }
    const _updateTextStartCount = () => {
      findElAndSetText('textStartCount', `Starts from ${state.startCount}`)
    }

    return {
      [obsDispEvents.OBS_CREATE]: () => {
        state.htmlEls = [
          addText({ tag: 'p', attrs: { class: 'textCounter' } }).then(() => {
            _startCounter()
            _updateCounterValue()
          }),
          addText({ attrs: { class: 'textIsRunning' } }),
          addText({ attrs: { class: 'textTickMs' } }).then(() => {
            _updateTextTickMs()
          }),
          addText({ attrs: { class: 'textStartCount' } }).then(() => {
            _updateTextStartCount()
          }),
          addBtn({
            attrs: { class: 'btnReset' },
            text: 'Reset',
            onClick: () => dispatchEvent('COUNTER_RESET'),
          }),
          addNewLine(),
          addBtn({
            attrs: { class: 'btnPause' },
            text: 'Pause',
            onClick: () => dispatchEvent('COUNTER_PAUSE'),
          }),
          addBtn({
            attrs: { class: 'btnResume' },
            text: 'Resume',
            onClick: () => dispatchEvent('COUNTER_RESUME'),
          }).then(() => {
            _updateIsRunningEls()
          }),
          addNewLine(),
          addInput({
            attrs: {
              class: 'inputTickMs',
              value: state.tickMs,
              type: 'number',
              min: 0,
              max: 10000,
            },
            label: 'Updates Every (ms): ',
            onChange: (ev) => {
              const v = (ev as any).target.value
              dispatchEvent('COUNTER_SET_TICK_MS', { payload: { tickMs: parseInt(v || 1000) } })
            },
          }),
          addInput({
            attrs: {
              class: 'inputStartValue',
              value: state.startCount,
              type: 'number',
              min: -100,
              max: 100,
            },
            label: 'Start Value: ',
            onChange: (ev) => {
              const v = (ev as any).target.value
              dispatchEvent('COUNTER_SET_START_VALUE', {
                payload: { startValue: parseInt(v || 0) },
              })
            },
          }),
          addInput({
            attrs: {
              class: 'inputChangeAmount',
              value: state.changeAmount,
              type: 'number',
              min: -1000,
              max: 1000,
            },
            label: 'Change Amount: ',
            onChange: (ev) => {
              const v = (ev as any).target.value
              dispatchEvent('COUNTER_SET_CHANGE_AMOUNT', {
                payload: { changeAmount: parseInt(v || 1) },
              })
            },
          }),
        ]
      },
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
        state.changeAmount = payloadProp<number>('changeAmount')(ev)
      },
      COUNTER_RESTART: _restartCounter,
      /**
       * To be used only when externally (via event dispatch) updating state values
       * which also have corresponding inputs
       */
      COUNTER_REFRESH_INPUTS: () => {
        findElAndSetValue('inputChangeAmount', state.changeAmount)
        findElAndSetValue('inputStartValue', state.startCount)
        findElAndSetValue('inputTickMs', state.tickMs)
      },
      [obsDispEvents.OBS_REMOVE]: () => {
        _stopCounter()

        state.htmlEls.forEach((o) => o.remove())
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
