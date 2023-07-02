import { createAPI } from 'obs-disp'
import { exposeToWindow } from './common'

const logInBlue = (...args: any[]) => console.info(`%c${args[0]}`, 'color: blue', ...args.slice(1))

export const OD = createAPI({
  // for debugging (in this case) or potentially even for middelware purposes:
  onEvent: (ev) => logInBlue('EVENT DISP', ev),
  onObsCreated: (obs) => logInBlue('OBS ADDED', obs),
  onObsRemoved: (obs) => logInBlue('OBS REMOVED', obs),
  onWarn: ({ msg, params }) => logInBlue('WARN: ', msg, params),
})
exposeToWindow({ OD })

export const { addObsDisp, dispatchEvent, obsDispCreator, removeObs, removeObsById, getObsById } =
  OD
