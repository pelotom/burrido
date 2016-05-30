import immutagen from 'immutagen'

import { errYieldNonLazyValue } from './messages'

export default ({
  pure,
  bind
}) => {
  const
    lazyPure = x => () => pure(x),
    lazyBind = (m, f) => {
      if (typeof m !== 'function')
        throw new Error(errYieldNonLazyValue)
      return () => bind(m(), x => f(x)())
    },
    doNext = next => input => {
      const { value, next: nextNext } = next(input)
      return nextNext ? lazyBind(value, doNext(nextNext)) : lazyPure(value)
    }

  return {
    Do: genFactory => doNext(immutagen(genFactory))()
  }
}
