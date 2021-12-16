// saqel9wzqgk のようなランダムな文字列を返す
// see: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript/8084248#8084248
export default () => {
  return Math.random().toString(36).substring(2)
}
