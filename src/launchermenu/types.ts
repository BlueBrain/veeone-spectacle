import { SvgIconComponent } from "@mui/icons-material"

export interface MenuItem {
  label: string
  icon: SvgIconComponent
  action(): void
}

export interface MenuData {
  items: MenuItem[]
}
