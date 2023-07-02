export const CounterText = Object.freeze({
  create: () => {
    const el = document.createElement('p')
    el.setAttribute('id', 'counterText')
    document.body.appendChild(el)
    return el
  },
  findInput: () => {
    return document.querySelector('#counterText')
  },
  setValue: (val) => {
    CounterText.findInput().textContent = val
  },
  getValue: () => {
    return parseInt(CounterText.findInput().textContent)
  },
  destroy: () => {
    CounterText.findInput()?.remove()
  },
})

export default CounterText
