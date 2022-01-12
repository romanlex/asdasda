import { Event } from 'effector'
import { domain } from './domain'

export const changeCurrency: Event<App.Currency> = domain.createEvent('change app currency')
