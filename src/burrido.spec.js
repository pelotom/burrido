import { assert } from 'chai'

import Monad from './burrido'

const ArrayMonad = Monad({
  pure: (x) => [x],
  bind: (xs, f) => xs.map(f).reduce((a, b) => a.concat(b), [])
})

const MaybeMonad = Monad({
  pure: (x) => x,
  bind: (x, f) => x === null ? null : f(x)
})

describe('monad', () => {
  it('works for Maybe', () => {
    const { Do } = MaybeMonad
    assert.equal(3, Do(function*(){
      const x = yield 3
      return x
    }))
    assert.equal(null, Do(function*(){
      const x = yield 3
      const y = yield null
      return x + y
    }))
  })
  it('works for Array', () => {
    const { Do } = ArrayMonad
    const result = Do(function*() {
      const x = yield [1,2]
      const y = yield [3,4]
      return x * y
    })
    assert.deepEqual([3,4,6,8], result)
  })
})
