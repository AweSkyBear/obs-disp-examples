import { IObserverTreeNode } from 'obs-disp'
import { OD } from './OD'
import { createHtmlEl } from './common'

import _1ex1 from './1-Counter-JS/ex1-CreateAutoCounter1-minimal'
import _1ex2 from './1-Counter-JS/ex2-CreateAutoCounter2-stateful'

import _2exAddObsDisp from './2-OD-Basic-API-Tinkering/#-addObsDisp'
import _2exObsDispCreator from './2-OD-Basic-API-Tinkering/#-obsDispCreator'
import _2exObsGetById from './2-OD-Basic-API-Tinkering/#-getObsById'
import _2exObsRemoveById from './2-OD-Basic-API-Tinkering/#-removeObsById'
import _2exSingleton from './2-OD-Basic-API-Tinkering/#-Singleton'
import _2exEventPayload from './2-OD-Basic-API-Tinkering/#-EventPayload'
import _2exTypedEvents from './2-OD-Basic-API-Tinkering/#-TypedEvents'
import _2exObsCreationParams from './2-OD-Basic-API-Tinkering/#-ObsCreationParams'

import _2exMeta from './2-OD-Basic-API-Tinkering/#-obsMeta'
import _2exObsInstance from './2-OD-Basic-API-Tinkering/#-obsInstance'
import _2exObsAddChildren from './2-OD-Basic-API-Tinkering/#-obs.addOD'
import _2exDispatchTargetPredicate from './2-OD-Basic-API-Tinkering/#-dispatchTargetPredicate'
import _2exParentRemoveChildBehav from './2-OD-Basic-API-Tinkering/#-parent-remove-child-behavior'
import _2exAddRemoveDispatchMix from './2-OD-Basic-API-Tinkering/#-add-remove-dispatch-mix'
import _2exChildrenNested from './2-OD-Basic-API-Tinkering/#-ODChildObservers2'
import _2exObsDispatchEvent from './2-OD-Basic-API-Tinkering/#-obs.dispatchEvent'
// import _2ex4 from './2-OD-Basic-API-Tinkering/ex4-ScopedOrInstanceOD'
// import _2ex5 from './2-OD-Basic-API-Tinkering/ex5-DispatchEventWithPayload'
// import _2ex6 from './2-OD-Basic-API-Tinkering/ex6-TypedEvents-ConstructEvents'
// import _2ex7 from './2-OD-Basic-API-Tinkering/ex7-Componentization'

import _3ex1 from './3-Counter-Full-Power/ex1-CounterToAcceptProps'
import _3ex2 from './3-Counter-Full-Power/ex2-AddAdditionalControls'
import _3ex3 from './3-Counter-Full-Power/ex3-AddAdditionalControlsLessState'
import _3ex4 from './3-Counter-Full-Power/ex4-ExtractingOutControlODs'
import _3ex5 from './3-Counter-Full-Power/ex5-MultipleCounterInstances'
import _3exMasterOfCounters from './3-Counter-Full-Power/ex6-MasterOfCounters'
import _3ex7 from './3-Counter-Full-Power/ex7-GoingMeta'

const sectionToExamples = {
  'Simplest Counter / Plain JS': [
    [
      _1ex1,
      'createAutoCounter - stateless',
      `Auto-counter: very simple stateless observer in plain JS`,
    ],
    [
      _1ex2,
      'createAutoCounter - stateful',
      `Auto-counter: very simple stateFUL observer in plain JS`,
    ],
  ],
  'Basic APIs': [
    [_2exAddObsDisp, 'addObsDisp', 'Add an `inline` observer on the spot - quick and dirty'],
    [_2exObsDispCreator, 'obsDispCreator', 'The scalable way to create observers - obsDispCreator'],
    [_2exObsGetById, 'getObsById', 'Return an observer by its id (when you know it)'],
    [
      _2exObsRemoveById,
      'removeObsById',
      'Remove an observer by id. This triggers its OBS_REMOVE event',
    ],
    [_2exSingleton, 'Singleton obs', 'Pass options with `id` param to make it a singleton'],
    [_2exEventPayload, 'Event payload', 'Pass and handle different event payload'],
    [
      _2exTypedEvents,
      'Typed events',
      'Use TypeScript to define events rather than using plain strings',
    ],
    [_2exObsCreationParams, 'Obs creation params', 'Pass initial params when creating an observer'],
    [_2exMeta, 'Obs meta', 'Pass `meta` to obs options'],
    [_2exObsInstance, 'Getting obs instance', 'Useful in several cases'],
    [_2exObsAddChildren, 'Children: obs.addOD (add child)'],
    [
      _2exChildrenNested,
      'Children: nested',
      'The parent and child are bound and the separate obs is not',
    ],
    [
      _2exObsDispatchEvent,
      'Children: obs.dispatchEvent',
      'Events dispatchtes in an obs tree are contained there',
    ],
    [
      _2exDispatchTargetPredicate,
      'Dispatch target - Predicate',
      'You can use a predicate function to determine to which observer the event will be dispatched',
    ],
    [
      _2exParentRemoveChildBehav,
      'Parent Remove - Children too',
      'Removing a parent removes all of its children / no matter how many levels',
    ],
    [_2exAddRemoveDispatchMix, 'add/remove/dispatch mix', 'Notice the order of events'],
  ],
  'Counter - Full Power!': [
    [_3ex1, 'Accept initial props', "Let's count from 42"],
    [_3ex2, 'Additional Controls - raw', 'We can better this / check next example'],
    [_3ex3, 'Additional Controls - Less state', 'We still can better this / check next example'],
    [
      _3ex4,
      'Componentization - Reusable UI Components!',
      "Ultimate example of how to utilize componentized obs-disp's",
    ],
    [
      _3ex5,
      'Multiple Auto-counter instances!',
      'When Counter is not singleton and it has children, it can act as a reusable component!',
    ],
    [
      _3exMasterOfCounters,
      'Master of Counters',
      "It's very easy to affect multiple observers at once. Done in 3 min.",
    ],
  ],
  // TODO: 'App Example - TODOist .. Enhanced': [] as any,
  // TODO: 'App Example - Circle Drawer .. Enhanced': [] as any,
  // TODO?: 'Sample Conventions': [_2ex4, _2ex5, _2ex6, _2ex7] as any,
}

//// generate TOC  HTML
const sections = Object.keys(sectionToExamples).map(
  (sectionName: keyof typeof sectionToExamples, ind) => {
    const section = createHtmlEl(`<h2>${ind + 1}) ${sectionName}</h2>`)

    let _lastActiveDescription = ''
    const buttons = (sectionToExamples[sectionName] as [Array<() => void>, string]).map(
      (runExampleWithDescr, ind) => {
        const runExample = runExampleWithDescr[0] as Function
        const title = runExampleWithDescr[1] || `Example ${ind + 1}`
        const description = runExampleWithDescr[2] || ''

        const runExBtn = createHtmlEl(
          `<button class="run-example" data-section="${sectionName}" data-hover="${description}"
            data-ind="${ind + 1}">${title}</button>`
        )
        runExBtn.querySelector('button').onclick = () => {
          const clean = (document.querySelector('#clean-before-run') as HTMLInputElement).checked
          if (clean) {
            console.clear()
            OD.removeAllObservers()
          }

          _lastActiveDescription =
            document.querySelector<HTMLElement>('.example-description').innerHTML || ''

          runExBtn
            .closest('.toc-sidebar')
            .querySelectorAll('.run-example')
            .forEach((el) => el.classList.remove('active'))

          runExBtn.querySelector('button').classList.add('active')

          runExample()
        }
        runExBtn.querySelector('button').onpointerenter = () => {
          document.querySelector<HTMLElement>('.example-description').innerHTML = description + ''
        }
        runExBtn.querySelector('button').onpointerleave = () => {
          document.querySelector<HTMLElement>('.example-description').innerHTML =
            _lastActiveDescription
        }

        return runExBtn
      }
    )
    buttons.forEach((b) => section.appendChild(b))

    return section
  }
)

//// TOC
const tocSidebar = createHtmlEl('')
tocSidebar.setAttribute('class', 'toc-sidebar')
sections.forEach((s) => tocSidebar.appendChild(s))
document.body.appendChild(tocSidebar)

//// Example description
const exampleDescription = createHtmlEl('')
exampleDescription.setAttribute('class', 'example-description')
exampleDescription.innerHTML = 'Example Description: using basic API - adding an observer'
// <div class="example-description">Example Description: using basic API - adding an observer</div>
document.body.appendChild(exampleDescription)

//// clean-before-running-example checkbox
document.body.appendChild(
  (() => {
    const html = `
      <input type="checkbox" id="clean-before-run" checked>
      <label for="clean-before-run">Clear existing observers and console before running example</label>
    `

    const el = createHtmlEl(html)
    el.classList.add('checkbox-clean')

    return el
  })()
)

//// remove all observers btn
document.body.appendChild(
  (() => {
    const el = createHtmlEl("<button class='btn-remove-all-ODs'>Remove all ODs</button>")
    el.onclick = () => {
      OD.removeAllObservers()
    }
    return el
  })()
)

const observersTreeEl = document.createElement('ul')

const _renderObsRemoveBtn = (obs: IObserverTreeNode) => {
  return `<button class="obs-delete" data-id=${obs.id}> X </button> `
}
const _renderObsChildren = (obs: IObserverTreeNode) => {
  if (obs.children.length === 0) return ''

  return ['<ul class="obs-children">', obs.children.map(_renderObs), '</ul>'].flat().join('')
}

const _renderObs = (obs: IObserverTreeNode): string => {
  return [
    '<li class="obs">',
    '<span class="obs-delete">',
    _renderObsRemoveBtn(obs),
    '</span>',
    '<span class="obs-id">',
    obs.id,
    '</span>',
    '<span class="obs-name">',
    ' :: ',
    obs.name,
    '</span>',
    _renderObsChildren(obs),
    '</li>',
  ].join('')
}
const _renderObsTree = () => {
  const html: string = [OD.getObserversTree().map(_renderObs).join('')].join('')
  observersTreeEl.innerHTML = `<h2>ODs Tree</h2>` + html
  document.querySelector('.obs')
}

// handle events in the tree
observersTreeEl.addEventListener('click', (ev) => {
  if ((ev.target as HTMLElement).classList.contains('obs-delete')) {
    const obsId = (ev.target as HTMLElement).dataset.id
    OD.removeObsById(obsId)
  }
})

const _obsTreeUpdateInterval = setInterval(_renderObsTree, 200)
;(window as any)._obsTreeUpdateInterval = _obsTreeUpdateInterval

//// LEFT sidebar - obs tree
const leftSidebar = document.createElement('div')
leftSidebar.setAttribute('class', 'left-sidebar')
leftSidebar.appendChild(observersTreeEl)
document.body.appendChild(leftSidebar)
