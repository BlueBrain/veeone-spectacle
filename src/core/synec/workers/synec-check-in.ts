interface SynecCheckInWorkerArgs {
  checkInWebSocketPath: string
}

interface CheckInWorkerMessage {
  method: string
  payload: { [key: string]: any }
}

class SynecCheckInWorker {
  public ready = false
  private checkInWebSocketPath: string
  private intervalHandle: number
  private ws: WebSocket

  initialize(args: SynecCheckInWorkerArgs) {
    console.debug("SynecCheckInWorker started")
    this.checkInWebSocketPath = args.checkInWebSocketPath
    this.connect()
  }

  connect() {
    this.ws = new WebSocket(this.checkInWebSocketPath)
    this.checkWebSocketReadyState()
  }

  checkWebSocketReadyState = () => {
    if (this.ws.readyState === 1) {
      this.ready = true
      postMessage({ method: "ready" })
    } else {
      console.debug("Waiting for ws connection...")
      setTimeout(this.checkWebSocketReadyState, 1000)
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
        console.warn("Unhandled worker method", message.data)
      }
    }
  }

  private sendStatusUpdate(payload) {
    if (!this.ready) {
      throw new Error("Not ready yet")
    }
    console.debug("Send status update...", Date.now(), "payload=", payload)
    this.ws.send(JSON.stringify(payload))
  }
}

const worker = new SynecCheckInWorker()

onmessage = worker.onmessage
