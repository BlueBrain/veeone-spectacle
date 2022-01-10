import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material"
import React, { useContext, useEffect, useState } from "react"
import { SpectacleContext } from "../core/spectacle/SpectacleContext"
import { useDispatch } from "react-redux"
import { loadPresentationStore } from "../core/redux/actions"

interface LoadPresentationModalProps {}
const LoadPresentationModal: React.FC<LoadPresentationModalProps> = () => {
  const spectacleContext = useContext(SpectacleContext)
  const [presentationList, setPresentationList] = useState([])
  const dispatch = useDispatch()

  useEffect(() => {
    async function loadPresentations() {
      const response = await spectacleContext.loadPresentation.listPresentations()
      setPresentationList(response.results)
    }
    void loadPresentations()
  }, [])

  const handlePresentationItemClick = async (presentationId: string) => {
    const newStore = await spectacleContext.loadPresentation.load(
      presentationId
    )
    console.debug("Load presentation...", presentationId, newStore)
    dispatch(loadPresentationStore(newStore))
  }

  return (
    <Dialog
      open={spectacleContext.loadPresentation.isModalOpen}
      onClose={spectacleContext.loadPresentation.closeModal}
      fullWidth={true}
      sx={{ top: "-40%" }}
    >
      <DialogTitle>Load presentation</DialogTitle>
      <DialogContent>
        <Grid container alignItems={"center"} sx={{ py: 3 }}>
          <Grid item xs>
            <List>
              {presentationList.map((presentationItem, i) => {
                const friendlyDateTime = new Date(
                  presentationItem.updatedAt
                ).toLocaleString()

                return (
                  <ListItemButton
                    key={i}
                    onClick={() =>
                      handlePresentationItemClick(presentationItem.id)
                    }
                  >
                    <ListItemText
                      primary={presentationItem.name}
                      secondary={friendlyDateTime}
                    />
                  </ListItemButton>
                )
              })}
            </List>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={event =>
            spectacleContext.loadPresentation.closeModal(event, "cancel")
          }
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default LoadPresentationModal
