import { createContext, useContext } from "react"
import { ApplicationConfig } from "./types"

const AppConfigContext = createContext<ApplicationConfig>(null)

export const useConfig = () => useContext(AppConfigContext)

export default AppConfigContext
