import { createContext, useContext } from "react"
import { MenuData } from "./types"

export interface LauncherMenuContextProps {
  menuData: MenuData
  setMenuData(menuData: MenuData): void
}

const LauncherMenuContext = createContext<LauncherMenuContextProps>(null)

export const useLauncherMenu = () => useContext(LauncherMenuContext)

export default LauncherMenuContext
