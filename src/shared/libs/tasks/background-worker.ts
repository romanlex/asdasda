export class BackgroundWorker<T> {
  _queue: Array<T> = []

  _handler?: (_arg: T) => void | Promise<void>

  add(item: T) {
    this._queue.push(item)
  }

  run(handler: (_arg: T) => void | Promise<void>) {
    this._handler = handler
    this._process()
  }

  _process = async () => {
    const item = this._queue.pop()

    if (item === undefined || item === null) {
      setTimeout(this._process, 1000)

      return
    }

    if (this._handler) await this._handler(item)
    setTimeout(this._process, 20)
  }
}
