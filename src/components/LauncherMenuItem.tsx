import * as React from "react"
import * as styles from "./LauncherMenuItem.module.scss"
import OpenIcon from "../assets/icons/open.inline.svg"
import { StaticImage } from "gatsby-plugin-image"

interface LauncherMenuItemProps {
  label: string

  onSelected()
}

type Props = LauncherMenuItemProps

const LauncherMenuItem = (props: Props) => {
  return <a onClick={props.onSelected}
            className={styles.LauncherMenuItem}>
    <div className={styles.IconWrapper}><OpenIcon width={"100%"} height={"100%"}/></div>
    {props.label}
  </a>
}

export default LauncherMenuItem
