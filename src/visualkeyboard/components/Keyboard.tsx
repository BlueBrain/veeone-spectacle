import { Box, Grid } from "@mui/material"
import React from "react"
import KeyboardKey from "./KeyboardKey"
import KeyboardRow from "./KeyboardRow"

const Keyboard: React.FC = () => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        width: `30rem`,
        background: `white`,
        padding: 1,
      }}
    >
      <Grid container spacing={1}>
        <KeyboardRow>
          <KeyboardKey symbol={"1"} />
          <KeyboardKey symbol={"2"} />
          <KeyboardKey symbol={"3"} />
          <KeyboardKey symbol={"4"} />
          <KeyboardKey symbol={"5"} />
          <KeyboardKey symbol={"6"} />
          <KeyboardKey symbol={"7"} />
          <KeyboardKey symbol={"8"} />
          <KeyboardKey symbol={"9"} />
          <KeyboardKey symbol={"0"} />
          <KeyboardKey symbol={"-"} />
          <KeyboardKey symbol={"="} />
          <KeyboardKey symbol={"Bksp"} />
        </KeyboardRow>
        <KeyboardRow>
          <KeyboardKey symbol={"q"} />
          <KeyboardKey symbol={"w"} />
          <KeyboardKey symbol={"e"} />
          <KeyboardKey symbol={"r"} />
          <KeyboardKey symbol={"t"} />
          <KeyboardKey symbol={"y"} />
          <KeyboardKey symbol={"u"} />
          <KeyboardKey symbol={"i"} />
          <KeyboardKey symbol={"o"} />
          <KeyboardKey symbol={"p"} />
          <KeyboardKey symbol={"["} />
          <KeyboardKey symbol={"]"} />
        </KeyboardRow>
        <KeyboardRow>
          <KeyboardKey symbol={"a"} />
          <KeyboardKey symbol={"s"} />
          <KeyboardKey symbol={"d"} />
          <KeyboardKey symbol={"f"} />
          <KeyboardKey symbol={"g"} />
          <KeyboardKey symbol={"h"} />
          <KeyboardKey symbol={"j"} />
          <KeyboardKey symbol={"k"} />
          <KeyboardKey symbol={"l"} />
          <KeyboardKey symbol={";"} />
          <KeyboardKey symbol={"'"} />
          <KeyboardKey symbol={"\\"} />
        </KeyboardRow>
        <KeyboardRow>
          <KeyboardKey symbol={"Shift️"} />
          <KeyboardKey symbol={"z"} />
          <KeyboardKey symbol={"x"} />
          <KeyboardKey symbol={"c"} />
          <KeyboardKey symbol={"v"} />
          <KeyboardKey symbol={"b"} />
          <KeyboardKey symbol={"n"} />
          <KeyboardKey symbol={"m"} />
          <KeyboardKey symbol={","} />
          <KeyboardKey symbol={"."} />
          <KeyboardKey symbol={"/"} />
        </KeyboardRow>
        <KeyboardRow>
          <KeyboardKey symbol={"!@#"} />
          <KeyboardKey symbol={"Space"} grow={3} />
          <KeyboardKey symbol={"🙂"} />
          <KeyboardKey symbol={"Go"} color={"primary"} />
        </KeyboardRow>
      </Grid>
    </Box>
  )
}

export default Keyboard
