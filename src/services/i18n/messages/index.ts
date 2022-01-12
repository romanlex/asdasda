import { MessageFormatElement } from 'react-intl'
import { AppLocale } from 'namespaces/enums'
import ru from './ru.json'
import en from './en.json'

export interface Messages {
  [AppLocale.ru]: Record<string, string> | Record<string, MessageFormatElement[]>
  [AppLocale.en]: Record<string, string> | Record<string, MessageFormatElement[]>
}
export const messages: Messages = { ru, en }
