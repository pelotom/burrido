# burrido [![Build Status](https://travis-ci.org/pelotom/burrido.svg?branch=master)](https://travis-ci.org/pelotom/burrido)

An experiment in bringing Haskell's [programmable semicolon](https://en.wikibooks.org/wiki/Haskell/do_notation) to JavaScript, using [generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator).

### Installation

```
npm install --save burrido
```

### Usage

```javascript
import Monad from 'burrido'

const ArrayMonad = Monad({
  pure: (x) => [x],
  bind: (xs, f) => xs.map(f).reduce((a, b) => a.concat(b), [])
})

ArrayMonad.Do(function*() {
  const x = yield [1,2]
  const y = yield [3,4]
  return x * y
}) // -> [3,4,6,8]
```

The above should look fairly self-explanatory to a Haskell programmer: we are declaring a `Monad` instance for arrays, which requires us to define two functions: `pure` and `bind`. Then we obtain a special function `Do` which is a *do*-notation tailored to that particular monad. We pass a [generator function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*) to `Do`, within which we gain access to the `yield` keyword, allowing us to "unwrap" monadic values and release their effects.

In fact this is a bit more versatile than Haskell's *do*-notation in a couple of interesting ways:
  1. Haskell's `Monad` is a [type class](https://www.haskell.org/tutorial/classes.html), which means that there can only be one way in which a given type constructor is considered a monad within a given scope. But some type constructors can be considered monadic in more than one way (e.g. `Either`). By contrast, here you can create as many `Monad` definitions as you want for a particular type (constructor), and each just has its own special `Do` function.
  1. While
  ```javascript
  const foo = yield bar
  ```

  is comparable to
  ```haskell
  foo <- bar
  ```

  in *do*-notation, one can also create compound `yield` expressions which have no direct analogue in Haskell. For example,
  ```javascript
  const foo = yield (yield bar)
  ```

  would have to be written as
  ```haskell
  foo' <- bar
  foo <- foo'
  ```

  in *do*-notation. In the context of `Do` blocks, `yield` serves a similar purpose to the `!` operator in both [Idris](http://www.idris-lang.org/) and the [Effectful](https://github.com/pelotom/effectful) library for Scala.

### An example using [RxJS](https://github.com/Reactive-Extensions/RxJS)

RxJS `Observable`s form a monad in several different ways:

```javascript
const { just: pure } = Observable

const { Do: doConcat } = Monad({
  pure,
  bind: (x, f) => x.concatMap(f)
})

const { Do: doMerge } = Monad({
  pure,
  bind: (x, f) => x.flatMap(f)
})

const { Do: doLatest } = Monad({
  pure,
  bind: (x, f) => x.flatMapLatest(f)
})
```

It's insructive to see what happens when you apply these different *do*-notations to the same generator block:

```javascript
const { from } = Observable

const block = function*() {
  // for each x in [1,2,3]...
  const x = yield from([1,2,3])
  // wait 1 second
  yield pure({}).delay(1000)
  // then return the value
  return x
}

// Prints 1, 2, and 3 separated by 1 second intervals
doConcat(block).subscribe(console.log)
// Waits 1 second and then prints 1, 2, 3 all at once
doMerge(block).subscribe(console.log)
// Waits 1 second and then prints 3
doLatest(block).subscribe(console.log)
```

This should make sense if you think about the semantics of each of these different methods of "flattening" nested `Observable`s. Each `do*` flavor applies its own semantics to the provided block, but they all return `Observable`s, so we can freely combine them:

```javascript
doConcat(function*() {
  const x = yield doConcat(function*() {
          //...
        }),
        y = yield doMerge(function*() {
          //...
        }),
        z = yield doLatest(function*() {
          //...
        })
  return { x, y, z }
})
```

RxJS has a function [`spawn`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/spawn.md) which allows you to use this kind of syntax with `Observable`s, but it only works properly with single-valued streams (essentially Promises), whereas burrido allows manipulating streams of multiple values, using multiple different semantics.
