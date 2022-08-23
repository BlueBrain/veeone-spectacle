import { createContext, useContext } from "react"

export interface WebsiteBlockContextProps {
  websiteUrl: string
}

const WebsiteBlockContext = createContext<WebsiteBlockContextProps>(null)

export default WebsiteBlockContext

export const useWebsiteBlock = () => useContext(WebsiteBlockContext)
