import React from 'react'
import { render } from 'react-dom'
import { fork } from 'effector'
import { MemoryRouter } from 'react-router-dom'
import { Application } from '../application'

describe('<App />', () => {
  test('renders without exploding', () => {
    const div = document.createElement('div')
    const scope = fork()
    render(
      <MemoryRouter>
        <Application root={scope} />
      </MemoryRouter>,
      div
    )
  })
})
