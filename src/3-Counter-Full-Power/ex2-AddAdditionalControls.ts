import { obsDispEvents, payloadProp } from 'obs-disp'
import { dispatchEvent, obsDispCreator } from '../OD'
import { addBtn } from './common/ex2-AddAdditionalControls/addBtn'
import { IHTMLElWrapper } from './common/ex2-AddAdditionalControls/addHtmlEl'
import { addInput } from './common/ex2-AddAdditionalControls/addInput'
import { addNewLine } from './common/ex2-AddAdditionalControls/addNewLine'
import { addText } from './common/ex2-AddAdditionalControls/addText'

/**
 * Showcase:
 *
 * 1) adding Many additional controls, e.g. Reset, Pause, Resume buttons along with
 *  a few inputs for controlling how the counter behaves : )
 *  - we also get rid of the CounterText abstraction
 * 2) using a more versatile `addHtmlEl` abstraction to deal with our HTML els (raw, plain JS);
 * I must warn you!: This is just for example purposes and not production quality;
 * it was written on the go
 * 3) heavy usage of events - this is a full program we have here!
 * 4) we can dispatch events from the outside and it all will work (see bottom comments)
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
      //
      textCounter: null as IHTMLElWrapper<HTMLDivElement>,
      textIsRunning: null as IHTMLElWrapper,
      textTickMs: null as IHTMLElWrapper<HTMLDivElement>,
      textStartCount: null as IHTMLElWrapper,
      btnReset: null as IHTMLElWrapper,
      btnResume: null as IHTMLElWrapper,
      btnPause: null as IHTMLElWrapper,
      inputTickMs: null as IHTMLElWrapper<HTMLInputElement>,
      inputStartValue: null as IHTMLElWrapper,
      inputChangeAmount: null as IHTMLElWrapper,
      miscHtmlEls: [] as IHTMLElWrapper[],
    }

    const _updateCounterValue = () => state.textCounter.setText(state.count)
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
      if (state.textIsRunning) state.textIsRunning.el.innerText = `Is Running: ${state.isRunning}`
      state.btnPause?.setDisabled(!state.isRunning)
      state.btnResume?.setDisabled(state.isRunning)
    }

    const _updateTextTickMs = () => {
      state.textTickMs.el.innerText = `Updates every ${state.tickMs / 1000}s`
    }
    const _updateTextStartCount = () => {
      state.textStartCount.el.innerText = `Starts from ${state.startCount}`
    }

    return {
      [obsDispEvents.OBS_CREATE]: () => {
        state.textCounter = addText({ tag: 'p' })

        _startCounter()

        state.textIsRunning = addText()

        state.textTickMs = addText()
        _updateTextTickMs()

        state.textStartCount = addText()
        _updateTextStartCount()

        state.btnReset = addBtn({ text: 'Reset', onClick: () => dispatchEvent('COUNTER_RESET') })
        state.miscHtmlEls.push(addNewLine())

        state.btnPause = addBtn({ text: 'Pause', onClick: () => dispatchEvent('COUNTER_PAUSE') })
        state.btnResume = addBtn({ text: 'Resume', onClick: () => dispatchEvent('COUNTER_RESUME') })
        _updateIsRunningEls()

        state.miscHtmlEls.push(addNewLine())
        state.inputTickMs = addInput({
          attrs: { value: state.tickMs, type: 'number', min: 0, max: 10000 },
          label: 'Updates Every (ms): ',
          onChange: (ev) => {
            const v = (ev as any).target.value
            dispatchEvent('COUNTER_SET_TICK_MS', { payload: { tickMs: parseInt(v || 1000) } })
          },
        })

        state.inputStartValue = addInput({
          attrs: { value: state.startCount, type: 'number', min: -100, max: 100 },
          label: 'Start Value: ',
          onChange: (ev) => {
            const v = (ev as any).target.value
            dispatchEvent('COUNTER_SET_START_VALUE', { payload: { startValue: parseInt(v || 0) } })
          },
        })

        state.inputChangeAmount = addInput({
          attrs: { value: state.changeAmount, type: 'number', min: -1000, max: 1000 },
          label: 'Change Amount: ',
          onChange: (ev) => {
            const v = (ev as any).target.value
            dispatchEvent('COUNTER_SET_CHANGE_AMOUNT', {
              payload: { changeAmount: parseInt(v || 1) },
            })
          },
        })

        _updateCounterValue()
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
        state.inputChangeAmount.setValue(state.changeAmount)
        state.inputStartValue.setValue(state.startCount)
        state.inputTickMs.setValue(state.tickMs)
      },
      [obsDispEvents.OBS_REMOVE]: () => {
        _stopCounter()

        // ugly: shortcut to remove all objects that have a .remove method
        Object.values(state)
          .filter((o: any) => o && (o.remove || o instanceof Array))
          .forEach((o: any) =>
            o.remove ? o.remove() : o.forEach((o: any) => o.remove && o.remove())
          )
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
