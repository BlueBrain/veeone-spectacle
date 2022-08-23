import { createContext, useContext } from "react"

export interface WebsiteBlockContextProps {
  websiteUrl: string
  isInteractiveMode: boolean
  activateInteractiveMode: () => void
  deactivateInteractiveMode: () => void
  navigateBack: () => void
  navigateForward: () => void
  navigateUrl: (url: string) => void
  navigateHome: () => void
}

const WebsiteBlockContext = createContext<WebsiteBlockContextProps>(null)

export default WebsiteBlockContext

export const useWebsiteBlock = () => useContext(WebsiteBlockContext)
