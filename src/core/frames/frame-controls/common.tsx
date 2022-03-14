export const controlBarButtonSx = {
  padding: ".2rem",
  margin: "0 .2rem",
  transition: "background ease 500ms",
  background: theme => theme.palette.primary.main,
  svg: {
    fill: `rgba(255, 255, 255, 1)`,
  },
  "&:hover": {
    background: theme => theme.palette.primary.dark,
  },
}
