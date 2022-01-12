import React from 'react'
import { createDomain, createEffect, createEvent, createStore, guard } from 'effector'
import { createHatch } from 'shared/libs/effector/factories/hatch'

type ButtonClick = React.MouseEvent<HTMLButtonElement>

export const hatch = createHatch(createDomain('home-page'))
export const incrementClicked = createEvent<ButtonClick>()
export const resetClicked = createEvent<ButtonClick>()

const getRandomInitialFx = createEffect<void, number>()

export const $counterValue = createStore<number>(0)
export const $pagePending = getRandomInitialFx.pending

const $shouldGetNumber = $counterValue.map((value) => value === 0)

guard({
  source: hatch.enter,
  filter: $shouldGetNumber,
  target: getRandomInitialFx,
})

guard({
  source: hatch.enter,
  filter: $shouldGetNumber,
  target: getRandomInitialFx,
})

$counterValue
  .on(getRandomInitialFx.done, (_, { result }) => result)
  .on(incrementClicked, (value) => value + 1)
  .on(resetClicked, () => 0)

getRandomInitialFx.use(async () => {
  return Math.floor(Math.random() * 300)
})
