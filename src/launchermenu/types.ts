import { SvgIconComponent } from "@mui/icons-material"

export interface MenuItem {
  label: string
  icon: SvgIconComponent
  action?(): void
  children?: MenuItem[]
}

export interface MenuData {
  items: MenuItem[]
}
