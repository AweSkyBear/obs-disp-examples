import { addHtmlEl } from './addHtmlEl'

export const addInput = (
  props: {
    label?: string
    value?: any
    attachTo?: HTMLElement
    onChange?: (b: HTMLInputElement, ev: MouseEvent) => any
    attrs?: Record<string, unknown>
  } = {} as any
) =>
  addHtmlEl<HTMLInputElement>({
    ...props,
    tag: 'input',
  })
