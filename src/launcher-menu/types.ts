import { SvgIconComponent } from "@mui/icons-material"
import { Position } from "../common/types"

export interface MenuItem {
  label: string
  icon?: SvgIconComponent
  action?(): void
  isEnabled?: boolean
  isOpen?: boolean
  children?: MenuItem[]
}

export interface MenuData {
  items: MenuItem[]
}

export interface LauncherMenuData {
  menuId: string
  position: Position
  isFullyOpen: boolean
}

export type LauncherMenuId = string
