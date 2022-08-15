import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import SpectacleContext from "../core/spectacle/SpectacleContext"
import { useDispatch } from "react-redux"
import { loadPresentationStore } from "../core/redux/actions"
import { PresentationLoaderDetails } from "./PresentationLoaderDetails"
import { resizePresentationStore } from "../core/presentations/resizing"
import { useConfig } from "../config/AppConfigContext"
import { SlideshowRounded } from "@mui/icons-material"

interface LoadPresentationModalProps {}

const OpenPresentationModal: React.FC<LoadPresentationModalProps> = () => {
  const config = useConfig()
  const spectacleContext = useContext(SpectacleContext)
  const { left, top } = spectacleContext.openPresentationModalPosition
  const [isLoading, setIsLoading] = useState(false)
  const [presentationList, setPresentationList] = useState([])
  const [selectedPresentationId, setSelectedPresentationId] = useState(null)
  const dispatch = useDispatch()

  useEffect(() => {
    async function getPresentationList() {
      setIsLoading(true)
      const response = await spectacleContext.openPresentation.listPresentations()
      setPresentationList(response.results)
      setIsLoading(false)
    }
    void getPresentationList()
  }, [spectacleContext.openPresentation])

  const handlePresentationItemClick = async (presentationId: string) => {
    setSelectedPresentationId(presentationId)
  }

  const openPresentation = useCallback(
    presentationId => {
      async function dispatchLoad(id) {
        const store = await spectacleContext.openPresentation.load(id)
        const sizeAdjustedPresentationStore = resizePresentationStore(
          store,
          {
            width: config.VIEWPORT_WIDTH,
            height: config.VIEWPORT_HEIGHT,
          },
          config.MINIMUM_FRAME_LONG_SIDE,
          config.MAXIMUM_FRAME_LONG_SIDE,
          {
            width: config.FILE_BROWSER_WIDTH,
            height: config.FILE_BROWSER_HEIGHT,
          }
        )
        dispatch(loadPresentationStore(sizeAdjustedPresentationStore))
      }
      void dispatchLoad(presentationId)
    },
    [
      config.FILE_BROWSER_HEIGHT,
      config.FILE_BROWSER_WIDTH,
      config.MAXIMUM_FRAME_LONG_SIDE,
      config.MINIMUM_FRAME_LONG_SIDE,
      config.VIEWPORT_HEIGHT,
      config.VIEWPORT_WIDTH,
      dispatch,
      spectacleContext.openPresentation,
    ]
  )

  const closeModal = useCallback(
    event => spectacleContext.openPresentation.closeModal(event, "cancel"),
    [spectacleContext.openPresentation]
  )

  const handleOpenPresentationClick = useCallback(
    event => {
      openPresentation(selectedPresentationId)
      closeModal(event)
    },
    [closeModal, openPresentation, selectedPresentationId]
  )

  const presentations = useMemo(
    () =>
      presentationList.map((presentationItem, i) => {
        const friendlyDateTime = new Date(
          presentationItem.updatedAt
        ).toLocaleString()

        return (
          <ListItemButton
            key={i}
            onClick={() => handlePresentationItemClick(presentationItem.id)}
            selected={selectedPresentationId === presentationItem.id}
          >
            <ListItemIcon>
              <SlideshowRounded />
            </ListItemIcon>
            <ListItemText
              primary={presentationItem.name}
              secondary={friendlyDateTime}
            />
          </ListItemButton>
        )
      }),
    [presentationList, selectedPresentationId]
  )

  return (
    <Dialog
      open={spectacleContext.openPresentation.isModalOpen}
      onClose={spectacleContext.openPresentation.closeModal}
      fullWidth={Boolean(selectedPresentationId)}
      PaperProps={{
        sx: {
          position: "absolute",
          transform: "translate(-50%, -50%)",
          left,
          top,
        },
      }}
    >
      <DialogTitle>Open presentation</DialogTitle>
      <DialogContent>
        <Grid container alignItems={"stretch"}>
          <Grid
            item
            xs
            sx={{
              width: "20rem",
              position: "relative",
              maxHeight: "30vh",
              overflowY: "scroll",
            }}
          >
            {isLoading ? (
              <CircularProgress
                sx={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%)",
                }}
              />
            ) : null}
            <List>{presentations}</List>
          </Grid>
          {selectedPresentationId ? (
            <Grid
              item
              xs
              md={8}
              sx={{ display: "flex", maxHeight: "30vh", overflowY: "scroll" }}
            >
              <PresentationLoaderDetails
                presentationId={selectedPresentationId}
              />
            </Grid>
          ) : null}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeModal}>Cancel</Button>
        {selectedPresentationId ? (
          <Button onClick={handleOpenPresentationClick} variant={"contained"}>
            Open presentation
          </Button>
        ) : null}
      </DialogActions>
    </Dialog>
  )
}

export default OpenPresentationModal
