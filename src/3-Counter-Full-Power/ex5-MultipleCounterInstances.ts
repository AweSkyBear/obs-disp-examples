import { obsDispEvents, payloadProp, IObserver, ObsDispCreate } from 'obs-disp'
import { obsDispCreator } from '../OD'
import { createText } from './ex5-MultipleCounterInstances/createText'
import { createButton } from './ex5-MultipleCounterInstances/createButton'
import { createInput } from './ex5-MultipleCounterInstances/createInput'
import { createNewLine } from './ex5-MultipleCounterInstances/createNewLine'
import { addHtmlEl, IHTMLElWrapper } from './common/ex2-AddAdditionalControls/addHtmlEl'

/**
 * Showcase:
 *
 * 1) Make the AutoCounter a reusable component! Make several instances of it:
 *      - remove the ID on it (this allows creating more than 1 instance)
 *      - all events must be dispatched via `obs.dispatchEvent` and not the global event dispatch
 *          - this defaults the scope of the dispatched events (the targets) only to the
 *              observers inside of the given scope/tree!
 *          - this (event dispatching needs to be) applied also to the createText/Input/Button obs
 *            creators (which should be changed internally to dispatch events
 *            *from their observer instance* as part of the communication with the parent/s
 *            and between one another)
 *      - all observers must not only be created but also added as children to this observer via obs.addOD,
 *          e.g.obs.addOD(obsCreator()) instead of simply obsCreator()
 *          - this makes sure they are now *children* to the main observer (created via createAutoCounter) and
 *            events dispatched inside of this tree, will stay in the tree
 *          - all of this results in separately working instances of the counter which can be
 *            created via `createAutoCounter()`
 *      - finally, to also have the new elements under the same html parent, we create a container element and pass
 *        it down (`containerEl`) to all the individual child ODs
 *      - just for visual clarity we also add a title element to each counter
 * 2) Note: if we want an event dispatched to *all* counters (for example), simply dispatch it globally, and not
 *          from any given observer
 */
export const createAutoCounter = obsDispCreator<{ startCount: number; tickMs: number }>(
  ({ startCount, tickMs }) => {
    const state = {
      // 1):: - the observer instance we will get from OBS_CREATE event
      // will be used to dispatch events in the current scope
      obs: null as IObserver, //
      // 1.5):: - pass the containerEl to eahc child OD for creation inside
      containerEl: null as IHTMLElWrapper,
      count: startCount || 0,
      startCount,
      interval: null as NodeJS.Timer,
      tickMs: tickMs || 1000,
      changeAmount: 1,
      isRunning: true,
    }

    const _updateCounterValue = () =>
      // 3):: dispatching events via state.obs.dispatchEvent() - now in the current tree only
      // (by default, when `target` is not provided and obs.dispatchEvent is used)
      state.obs.dispatchEvent('EL_SET_TEXT', {
        payload: { name: 'textCounter', text: state.count },
      }) //findElAndSetText('textCounter', state.count)

    const _resetCounter = () => {
      state.count = parseInt(state.startCount as any) || 0
    }

    const _startCounter = () => {
      state.isRunning = true

      if (state.interval) return
      state.interval = setInterval(() => {
        state.obs.dispatchEvent('COUNTER_INCREASE', {
          payload: { changeAmount: state.changeAmount },
        })
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
      state.obs.dispatchEvent('EL_SET_TEXT', {
        payload: { name: 'textIsRunning', text: `Is Running: ${state.isRunning}` },
      })
      state.obs.dispatchEvent('EL_DISABLE', {
        payload: { name: 'btnPause', disabled: !state.isRunning },
      })
      state.obs.dispatchEvent('EL_DISABLE', {
        payload: { name: 'btnResume', disabled: state.isRunning },
      })
    }

    const _getTextTickMs = () => `Updates every ${state.tickMs / 1000}s`
    const _updateTextTickMs = () => {
      state.obs.dispatchEvent('EL_SET_TEXT', {
        payload: { name: 'textTickMs', text: _getTextTickMs() },
      })
    }
    const _getTextStartCount = () => `Starts from ${state.startCount}`
    const _updateTextStartCount = () => {
      state.obs.dispatchEvent('EL_SET_TEXT', {
        payload: { name: 'textStartCount', text: _getTextStartCount() },
      })
    }

    return {
      /// 2):: storing the created observer - make use of ObsDispCreate.useObs(obs)
      [obsDispEvents.OBS_CREATE]: ObsDispCreate.useObs((obs) => {
        /// 2.1):: store the obs for further use
        state.obs = obs

        // 3):: create the container html element for the other observers
        state.containerEl = addHtmlEl({ attrs: { class: 'counter' } })
        const el = state.containerEl
        addHtmlEl({
          tag: 'h3',
          attrs: { class: 'title' },
          text: `Counting From ${startCount} Originally`,
          attachTo: el.el,
        })

        state.obs.addOD(
          createText({ tag: 'p', name: 'textCounter', text: `${startCount}`, attachTo: el })
        )
        state.obs.addOD(
          createText({ name: 'textIsRunning', text: state.isRunning as any, attachTo: el })
        )
        state.obs.addOD(createText({ name: 'textTickMs', text: _getTextTickMs(), attachTo: el }))
        state.obs.addOD(
          createText({ name: 'textStartCount', text: _getTextStartCount(), attachTo: el })
        )

        state.obs.addOD(createButton({ name: 'btnReset', text: 'Reset', attachTo: el }))
        state.obs.addOD(createNewLine({ attachTo: el }))
        state.obs.addOD(createButton({ name: 'btnPause', text: 'Pause', attachTo: el }))
        state.obs.addOD(createButton({ name: 'btnResume', text: 'Resume', attachTo: el }))
        state.obs.addOD(createNewLine({ attachTo: el }))
        state.obs.addOD(
          createInput({
            name: 'inputTickMs',
            label: 'Updates Every (ms): ',
            value: state.tickMs,
            attrs: { type: 'number', min: 0, max: 10000 },
            attachTo: el,
          })
        )
        state.obs.addOD(
          createInput({
            name: 'inputStartValue',
            label: 'Start Value: ',
            value: state.startCount,
            attrs: { type: 'number', min: -100, max: 100 },
            attachTo: el,
          })
        )
        state.obs.addOD(
          createInput({
            name: 'inputChangeAmount',
            label: 'Change Amount: ',
            value: state.changeAmount,
            attrs: { type: 'number', min: -1000, max: 1000 },
            attachTo: el,
          })
        )

        // note: we are initiating counting in the next tick, since created observers
        // are not instantly available (e.g. their ON_CREATE is executed the next tick)
        // TODO: -> add 'onCreated' just inside of the observers
        setTimeout(() => _startCounter())
      }),
      /////////// -> Note: handling (component) observer events ///////////
      //// using EL_CLICK and EL_CHANGE events to route events to our component!
      EL_CLICK: (ev) => {
        const name = payloadProp<string>('name')(ev)
        switch (name) {
          case 'btnReset':
            state.obs.dispatchEvent('COUNTER_RESET')
            break
          case 'btnPause':
            state.obs.dispatchEvent('COUNTER_PAUSE')
            break
          case 'btnResume':
            state.obs.dispatchEvent('COUNTER_RESUME')
            break
        }
      },
      EL_CHANGE: (ev) => {
        const name = payloadProp<string>('name')(ev)
        const value = payloadProp<string>('value')(ev)
        switch (name) {
          case 'inputTickMs':
            state.obs.dispatchEvent('COUNTER_SET_TICK_MS', { payload: { tickMs: value } })
            break
          case 'inputStartValue':
            state.obs.dispatchEvent('COUNTER_SET_START_VALUE', { payload: { startValue: value } })
            break
          case 'inputChangeAmount':
            state.obs.dispatchEvent('COUNTER_SET_CHANGE_AMOUNT', {
              payload: { changeAmount: value },
            })
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

        state.isRunning && state.obs.dispatchEvent('COUNTER_RESTART')
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
        state.obs.dispatchEvent('EL_SET_VALUE', {
          payload: { name: 'inputChangeAmount', value: state.changeAmount },
        })
        state.obs.dispatchEvent('EL_SET_VALUE', {
          payload: { name: 'inputStartValue', value: state.startCount },
        })
        state.obs.dispatchEvent('EL_SET_VALUE', {
          payload: { name: 'inputTickMs', value: state.tickMs },
        })
      },
      [obsDispEvents.OBS_REMOVE]: () => {
        _stopCounter()

        state.containerEl.remove()
        // note: NO need to remove child observers manually, while this observer is removed -
        //// that is because all child observers are automatically removed when their parent is ! ! !
      },
    }
  }
)

const runExample = () => {
  Array.from(Array(5)).forEach((_, ind) => {
    createAutoCounter({ startCount: Math.pow(10, ind), tickMs: 1000 })
  })
  /*
  // Note: dispatching these will affect ALL instances of the counter

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
