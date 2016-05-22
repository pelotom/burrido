# burrido

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

The above should look fairly self-explanatory to a Haskell programmer: we are declaring a `Monad` instance for arrays, which requires us to define two functions: `pure` and `bind`. Then we obtain a special function `Do` which is a *do*-notation tailored to that particular monad. We pass a [generator function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*) to `Do`, within which we gain access to the `yield` keyword, which in this context can be thought of as a way to "unwrap" monadic values and release their effects.

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
