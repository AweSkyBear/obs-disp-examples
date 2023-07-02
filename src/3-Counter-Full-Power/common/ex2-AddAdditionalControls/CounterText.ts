export const CounterText = Object.freeze({
  create: () => {
    const el = document.createElement('input')
    el.setAttribute('disabled', '')
    el.setAttribute('id', 'counterText')
    document.body.appendChild(el)
    return el
  },
  findInput: () => document.querySelector<HTMLInputElement>('#counterText'),
  setValue: (val: any) => (CounterText.findInput().value = val),
  getValue: () => parseInt(CounterText.findInput().value),
  destroy: () => CounterText.findInput()?.remove(),
})

export default CounterText
