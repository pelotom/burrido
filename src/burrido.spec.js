import { assert } from 'chai'

import Monad from './burrido'

import { errYieldNonLazyValue } from './messages'

const { Do: doMaybe } = Monad({
  pure: (x) => x,
  bind: (x, f) => x === null ? null : f(x)
})

const { Do: doArray } = Monad({
  pure: (x) => [x],
  bind: (xs, f) => xs.map(f).reduce((a, b) => a.concat(b), [])
})

describe('Burrido', () => {
  it('can be used to define a Maybe monad', () => {
    assert.equal(3, doMaybe(function*(){
      return yield () => 3
    })())
    assert.equal(null, doMaybe(function*(){
      const x = yield () => 3
      const y = yield () => null
      return x + y
    })())
  })

  it('can be used to define an Array monad', () => {
    const result = doArray(function*() {
      const x = yield () => [1,2]
      const y = yield () => [3,4]
      return x * y
    })()
    assert.deepEqual([3,4,6,8], result)
  })

  it('works with nested do-blocks', () => {
    const result = doArray(function*() {
      const x = yield () => [1,2]
      const y = yield doArray(function*(){
        const z = yield () => [3,4]
        const w = yield () => [5,6]
        return [z,w]
      })
      return [x].concat(y)
    })()
    assert.deepEqual(
      [
        [1,3,5],
        [1,3,6],
        [1,4,5],
        [1,4,6],
        [2,3,5],
        [2,3,6],
        [2,4,5],
        [2,4,6]
      ], result)
  })

  it('does not repeat embedded effects', () => {
    let counter = 0
    const result = doArray(function*() {
      const x = yield () => { counter++; return [1,2] }
      const y = yield () => [3,4]
      return x * y
    })()
    assert.deepEqual([3,4,6,8], result)
    assert.equal(1, counter)
  })

  it('disallows do-blocks which yield non-lazy values', () => {
    assert.throws(() => doMaybe(function*() { yield 5 }), errYieldNonLazyValue)
  })
})
