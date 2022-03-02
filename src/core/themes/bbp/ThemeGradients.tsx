import * as React from "react"

const ThemeGradients = () => {
  return (
    <svg width={0} height={0}>
      <linearGradient
        id="linearColors"
        x1={1}
        y1={0}
        x2={1}
        y2={1}
        gradientTransform={"rotate(-45)"}
      >
        <stop offset={"0%"} stopColor="#00ecfd" />
        <stop offset={"100%"} stopColor="#4218b8" />
      </linearGradient>
    </svg>
  )
}

export default ThemeGradients
