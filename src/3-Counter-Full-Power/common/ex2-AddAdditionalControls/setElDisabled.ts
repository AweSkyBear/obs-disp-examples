export const setElDisabled = (el: HTMLElement, disabled: boolean) => {
  disabled ? el?.removeAttribute('disabled') : el?.setAttribute('disabled', '')
}
