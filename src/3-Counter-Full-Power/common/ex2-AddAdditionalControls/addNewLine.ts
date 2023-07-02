import { addHtmlEl } from './addHtmlEl'

export const addNewLine = (props: { attachTo?: HTMLElement } = {} as any) =>
  addHtmlEl<HTMLBRElement>({ ...props, tag: 'br' })
