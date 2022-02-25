declare module "*.svg" {
  const content: any
  export default content
}

declare global {
  interface Crypto {
    randomUUID: () => string
  }
}

export {}
