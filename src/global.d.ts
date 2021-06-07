declare module "*.scss" {
  const styles: { readonly [key: string]: string }
  export default styles
}

declare module "*.svg" {
  const content: any
  export default content
}
