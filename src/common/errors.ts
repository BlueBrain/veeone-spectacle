export class NotImplementedError extends Error {
  constructor() {
    super()
    Object.setPrototypeOf(this, Error.prototype)
  }
}
