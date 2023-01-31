import { generateRandomId } from "../../common/random"

interface SynecCheckInWorkerArgs {
  checkInWebSocketPath: string
}

interface CheckInWorkerMessage {
  method: string
  payload: { [key: string]: any }
}

class SynecCheckInWorker {
  public ready = false
  public initialized = false
  private checkInWebSocketPath: string
  private ws: WebSocket

  initialize(args: SynecCheckInWorkerArgs) {
    this.initialized = true
    this.checkInWebSocketPath = args.checkInWebSocketPath
    this.connect()
  }

  connect() {
    this.ws = new WebSocket(this.checkInWebSocketPath)
    this.ws.onclose = () => {
      this.ready = false
      setTimeout(() => this.connect(), 3000)
    }
    this.ws.onopen = () => {
      this.ready = true
      postMessage({ method: "ready" })
    }
  }

  onmessage = (message: MessageEvent) => {
    switch ((message.data as CheckInWorkerMessage).method) {
      case "initialize": {
        this.initialize(message.data.payload)
        break
      }
      case "statusUpdate": {
        this.sendStatusUpdate(message.data.payload)
        break
      }
      default: {
      }
    }
  }

  private sendStatusUpdate(payload) {
    if (!this.ready) {
      return
    }
    this.ws.send(
      JSON.stringify({
        id: generateRandomId(),
        method: "UpdateStatus",
        params: { payload },
      })
    )
  }
}

const worker = new SynecCheckInWorker()

onmessage = worker.onmessage
