import { MenuItem } from "./types"
import { CategoryRounded, SvgIconComponent } from "@mui/icons-material"
import React from "react"

class LauncherMenuItem implements MenuItem {
  label: string | React.ReactNode
  isEnabled: boolean
  isOpen: boolean = false
  icon: SvgIconComponent
  children: MenuItem[]

  action(): void {}

  constructor(args: MenuItem) {
    this.children = args.children ?? []
    this.label = args.label
    this.isEnabled = args.isEnabled ?? true
    this.isOpen = args.isOpen ?? false
    this.icon = args.icon ?? CategoryRounded
    this.action = args.action
  }
}

export default LauncherMenuItem
