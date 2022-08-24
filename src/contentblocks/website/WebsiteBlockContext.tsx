import { createContext, useContext } from "react"

export interface WebsiteBlockContextProps {
  websiteUrl: string
  isInteractiveModeOn: boolean
  activateInteractiveMode: () => void
  deactivateInteractiveMode: () => void
  navigateBack: () => void
  navigateForward: () => void
  navigateUrl: (url: string) => void
  navigateHome: () => void
  zoomPageIn: () => void
  zoomPageOut: () => void
  zoomLevel: number
  websiteIframeKey: string
}

const WebsiteBlockContext = createContext<WebsiteBlockContextProps>(null)

export default WebsiteBlockContext

export const useWebsiteBlock = () => useContext(WebsiteBlockContext)
