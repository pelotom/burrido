import immutagen from 'immutagen'

export default ({
  pure,
  bind
}) => {
  const doNext = next => input => {
    const { value, next: nextNext } = next(input)

    if (!nextNext)
      return pure(value)

    return bind(value, doNext(nextNext))
  }

  return {
    Do(genFactory) {
      return doNext(immutagen(genFactory))()
    }
  }
}
