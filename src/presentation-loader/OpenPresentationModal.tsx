import {
  Button,
  CircularProgress,
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
import { PresentationLoaderDetails } from "./PresentationLoaderDetails"
import { SlideshowRounded } from "@mui/icons-material"
import ConfirmDialog from "../confirm-dialog/ConfirmDialog"
import { usePresentationManager } from "../core/presentation-manager/PresentationManagerContext"
import { BaseDialog } from "../dialogs/DialogsContext"

const OpenPresentationModal: React.FC<BaseDialog> = ({
  position,
  resolveDialog,
  cancelDialog,
}) => {
  const presentationManager = usePresentationManager()
  const { veeDriveService, isPresentationClean } = useContext(SpectacleContext)

  const [isLoading, setIsLoading] = useState(false)
  const [presentationList, setPresentationList] = useState([])
  const [selectedPresentationId, setSelectedPresentationId] = useState(null)
  const [isUnsavedWarningVisible, setIsUnsavedWarningVisible] = useState(false)
  const showUnsavedWarningDialog = () => setIsUnsavedWarningVisible(true)
  const hideUnsavedWarningDialog = () => setIsUnsavedWarningVisible(false)

  useEffect(() => {
    async function getPresentationList() {
      setIsLoading(true)
      const response = await veeDriveService.listPresentations()
      setPresentationList(response.results)
      setIsLoading(false)
    }
    void getPresentationList()
  }, [veeDriveService])

  const handlePresentationItemClick = async (presentationId: string) => {
    setSelectedPresentationId(presentationId)
  }

  const openPresentation = useCallback(
    presentationId => {
      resolveDialog(presentationId)
    },
    [resolveDialog]
  )

  const handleOpenPresentationClick = useCallback(
    event => {
      if (isPresentationClean) {
        openPresentation(selectedPresentationId)
      } else {
        showUnsavedWarningDialog()
      }
    },
    [openPresentation, selectedPresentationId, isPresentationClean]
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

  const saveCurrentAndOpen = useCallback(
    async event => {
      await presentationManager.savePresentation({
        position,
      })
      await openPresentation(selectedPresentationId)
    },
    [openPresentation, selectedPresentationId, presentationManager, position]
  )

  const dontSaveCurrentAndOpen = useCallback(
    event => {
      openPresentation(selectedPresentationId)
    },
    [openPresentation, selectedPresentationId]
  )

  const unsavedWarningDialog = useMemo(
    () =>
      isUnsavedWarningVisible ? (
        <ConfirmDialog
          position={position}
          title={"Save current changes?"}
          text={
            "You have unsaved changes in your current presentation. " +
            "Do you want to save them before opening a new one?"
          }
          options={[
            {
              label: "No",
              action: dontSaveCurrentAndOpen,
              color: "warning",
              variant: "text",
            },
            { label: "Yes", action: saveCurrentAndOpen },
          ]}
          onCancel={hideUnsavedWarningDialog}
        />
      ) : null,
    [
      isUnsavedWarningVisible,
      dontSaveCurrentAndOpen,
      saveCurrentAndOpen,
      position,
    ]
  )

  return (
    <>
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
        <Button onClick={cancelDialog}>Cancel</Button>
        {selectedPresentationId ? (
          <Button onClick={handleOpenPresentationClick} variant={"contained"}>
            Open presentation
          </Button>
        ) : null}
      </DialogActions>

      {unsavedWarningDialog}
    </>
  )
}

export default OpenPresentationModal
