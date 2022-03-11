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
import SpectacleContext from "../core/spectacle/SpectacleContext"
import { useDispatch } from "react-redux"
import { loadPresentationStore } from "../core/redux/actions"
import { PresentationLoaderDetails } from "./PresentationLoaderDetails"

interface LoadPresentationModalProps {}

const LoadPresentationModal: React.FC<LoadPresentationModalProps> = () => {
  const spectacleContext = useContext(SpectacleContext)
  const { left, top } = spectacleContext.loadPresentationModalPosition
  const [presentationList, setPresentationList] = useState([])
  const [selectedPresentationId, setSelectedPresentationId] = useState(null)
  const dispatch = useDispatch()

  useEffect(() => {
    async function getPresentationList() {
      const response = await spectacleContext.loadPresentation.listPresentations()
      setPresentationList(response.results)
    }
    void getPresentationList()
  }, [spectacleContext.loadPresentation])

  const handlePresentationItemClick = async (presentationId: string) => {
    setSelectedPresentationId(presentationId)
  }

  const loadPresentation = presentationId => {
    async function dispatchLoad(id) {
      const store = await spectacleContext.loadPresentation.load(id)
      dispatch(loadPresentationStore(store))
    }
    void dispatchLoad(presentationId)
  }

  const closeModal = event =>
    spectacleContext.loadPresentation.closeModal(event, "cancel")

  return (
    <Dialog
      open={spectacleContext.loadPresentation.isModalOpen}
      onClose={spectacleContext.loadPresentation.closeModal}
      fullWidth={true}
      PaperProps={{
        sx: {
          position: "absolute",
          transform: "translate(-50%, -50%)",
          left,
          top,
        },
      }}
    >
      <DialogTitle>Presentations</DialogTitle>
      <DialogContent>
        <Grid container alignItems={"flex-start"}>
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
          {selectedPresentationId !== null ? (
            <Grid item xs md={8}>
              <PresentationLoaderDetails
                presentationId={selectedPresentationId}
                onLoadRequest={event => {
                  loadPresentation(selectedPresentationId)
                  closeModal(event)
                }}
              />
            </Grid>
          ) : null}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeModal}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}

export default LoadPresentationModal
