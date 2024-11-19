export function isObjectLike(value: object): boolean {
  return Object.prototype.toString.call(value) === '[object Object]'
}
