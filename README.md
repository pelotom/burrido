# burrido

Monadic do-notation for JavaScript.

### Installation

```
npm install --save burrido
```

### Usage

```javascript
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

### Background

This library is an experiment in bringing the Haskell's [programmable semicolon](https://en.wikipedia.org/wiki/Monad_%28functional_programming%29) to JavaScript. Haskell's [do-notation](https://en.wikibooks.org/wiki/Haskell/do_notation) can be a convenient way to structure many different kinds of effectful code.
