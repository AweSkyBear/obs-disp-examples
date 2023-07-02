declare const window: any

export const exposeToWindow = (varObj: any) => {
  // note: ONLY for debug mode!
  const result = Object.keys(varObj).map((key) => {
    const value = varObj[key]
    window[key] = value
    window.__EXPOSED = window.__EXPOSED || {}
    window.__EXPOSED[key] = value

    return [key, value]
  })

  return result
}

export const createHtmlEl = (html: string = '', tag: string = 'div') => {
  const el = document.createElement(tag)
  if (html) {
    el.innerHTML = html
  }
  return el
}
