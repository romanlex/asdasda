import { Event } from 'effector'
import { domain } from './domain'

export const changeLocale: Event<App.Locale> = domain.createEvent('change locale')
