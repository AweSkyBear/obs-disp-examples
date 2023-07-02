import { addHtmlEl } from './addHtmlEl'

export const addBtn = (
  props: {
    text: string
    onClick?: (b: HTMLButtonElement, ev: MouseEvent) => any
    attachTo?: HTMLElement
    attrs?: Record<string, unknown>
  } = {} as any
) =>
  addHtmlEl<HTMLButtonElement>({
    tag: 'button',
    ...props,
  })
