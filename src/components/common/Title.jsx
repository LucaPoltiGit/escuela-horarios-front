import { APP_COLORS } from '../../constants/text'

export function Title({ as: Component = 'h1', children, align = 'left' }) {
  const style = {
    margin: 0,
    color: APP_COLORS.text,
    textAlign: align,
  }

  return <Component style={style}>{children}</Component>
}
