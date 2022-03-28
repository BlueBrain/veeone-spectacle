import { SvgIconComponent } from "@mui/icons-material"

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
