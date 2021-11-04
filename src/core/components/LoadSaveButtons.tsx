import { Button } from "@material-ui/core"
import * as React from "react"
import { useDispatch, useSelector } from "react-redux"
import { PresentationStateData } from "../presentations/interfaces"
import { loadPresentation } from "../redux/actions"

const LoadSaveButtons: React.FC = () => {
  const dispatch = useDispatch()
  const store = (useSelector<PresentationStateData>(
    s => s
  ) as unknown) as PresentationStateData

  const load = () => {
    const loadedPresentation = JSON.parse(
      localStorage.getItem("presentation") ?? "{}"
    )
    console.debug("Load state from local storage", loadedPresentation)
    if (Object.keys(loadedPresentation).length > 0) {
      dispatch(loadPresentation(loadedPresentation))
    } else {
      console.warn("No presentation data available in storage")
    }
  }

  const save = () => {
    localStorage.setItem(
      "presentation",
      JSON.stringify({
        id: new Date().toISOString(),
        state: store,
      })
    )
  }

  return (
    <div>
      <Button onClick={load} variant={"contained"}>
        Load
      </Button>
      <Button onClick={save} variant={"contained"}>
        Save
      </Button>
    </div>
  )
}

export default LoadSaveButtons
