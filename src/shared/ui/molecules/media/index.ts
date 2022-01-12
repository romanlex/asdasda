import { useStore } from 'effector-react/scope'
import { Queries, screenQueries } from './model/store'

export type TypeMedia = {
  desktop: boolean
  extraLarge: boolean
  extraSmall: boolean
  large: boolean
  medium: boolean
  mobile: boolean
  portrait: boolean
  small: boolean
  tablet: boolean
}

export type MediaProps = TypeMedia & {
  children: JSX.Element | null
  landscape: boolean
}

function orientationCheck(props: MediaProps, queries: Queries) {
  if (!props.portrait && !props.landscape) return true

  return (props.portrait && queries.portrait) || (props.landscape && !queries.portrait)
}

function screenSizeCheck(props: MediaProps, queries: Queries) {
  if (!props.extraSmall && !props.small && !props.medium && !props.large && !props.extraLarge) return true

  return (
    (props.extraSmall && queries.extraSmall) ||
    (props.small && queries.small) ||
    (props.medium && queries.medium) ||
    (props.large && queries.large) ||
    (props.extraLarge && queries.extraLarge)
  )
}

export const Media = (props: MediaProps) => {
  // eslint-disable-next-line prefer-const
  let p: MediaProps = { ...props }

  if (p.mobile) {
    p.small = true
    p.extraSmall = true
  }

  if (p.tablet) {
    p.medium = true
  }

  if (p.desktop) {
    p.large = true
    p.extraLarge = true
  }

  const queries = useStore(screenQueries)
  const screenSizeAllowed = screenSizeCheck(p, queries)
  const orientationAllowed = orientationCheck(p, queries)

  if (orientationAllowed && screenSizeAllowed) {
    return p.children
  }

  return null
}

Media.defaultProps = {
  children: null,
  desktop: false,
  extraLarge: false,
  extraSmall: false,
  landscape: false,
  large: false,
  medium: false,
  mobile: false,
  portrait: false,
  small: false,
  tablet: false,
}
