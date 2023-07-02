import { addHtmlEl } from './addHtmlEl'

export const addText = (
  props: {
    text?: string
    attrs?: Record<string, unknown>
    onClick?: (b: HTMLButtonElement, ev: MouseEvent) => any
    attachTo?: HTMLElement
    doNotAttach?: boolean
    tag?: string
  } = {} as any
) =>
  addHtmlEl<HTMLDivElement>({
    tag: props.tag || 'div',
    text: props.text || '',
    doNotAttach: props.doNotAttach,
    attachTo: props.attachTo,
    attrs: props.attrs,
  })
