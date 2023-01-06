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
import SpectacleStateContext, {
  useSpectacle,
} from "../../../spectacle/SpectacleStateContext"
import { PresentationLoaderDetails } from "./PresentationLoaderDetails"
import { SlideshowRounded } from "@mui/icons-material"
import { useDialogs } from "../../../dialogs/DialogsContext"
import UnsavedChangesWarning from "../UnsavedChangesWarning"
import { useActiveDialog } from "../../../dialogs/ActiveDialogContext"
import PresentationFolderList from "../save-as/PresentationFolderList"

const OpenPresentationModal: React.FC = () => {
  const { dialogOptions, resolveDialog, cancelDialog } = useActiveDialog()
  const { veeDriveService, isPresentationClean } = useSpectacle()
  const dialogs = useDialogs()
  const [isLoading, setIsLoading] = useState(false)
  const [presentationList, setPresentationList] = useState([])
  const [selectedPresentationId, setSelectedPresentationId] = useState(null)
  const [selectedFolderName, setSelectedFolderName] = useState(null)

  useEffect(() => {
    async function getPresentationList() {
      setIsLoading(true)
      const response = await veeDriveService.listPresentations(
        selectedFolderName
      )
      setPresentationList(response.results)
      setIsLoading(false)
    }
    void getPresentationList()
  }, [selectedFolderName, veeDriveService])

  const handlePresentationItemClick = async (presentationId: string) => {
    setSelectedPresentationId(presentationId)
  }

  const openPresentation = useCallback(
    presentationId => {
      resolveDialog(presentationId)
    },
    [resolveDialog]
  )

  const handleOpenPresentationClick = useCallback(async () => {
    if (!isPresentationClean) {
      const result = await dialogs.openDialog(UnsavedChangesWarning, {
        position: dialogOptions.position,
        maxWidth: "xs",
      })
      console.debug("NEW PRESENTATION RESULT", result)
    }
    openPresentation(selectedPresentationId)
  }, [
    isPresentationClean,
    openPresentation,
    selectedPresentationId,
    dialogs,
    dialogOptions.position,
  ])

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

  const toggleFolderSelect = useCallback(
    (folderName: string) => {
      if (selectedFolderName !== folderName) {
        setSelectedFolderName(folderName)
      } else {
        setSelectedFolderName(null)
      }
    },
    [selectedFolderName]
  )

  const clearPresentationId = useCallback(() => {
    setSelectedPresentationId(null)
  }, [])

  return (
    <>
      <DialogTitle>Open presentation</DialogTitle>
      <DialogContent sx={{ height: `20rem` }}>
        <Grid container alignItems={"stretch"}>
          <Grid item xs md={4}>
            <PresentationFolderList
              selectedFolderName={selectedFolderName}
              onSelectFolder={toggleFolderSelect}
              showCreateNewFolderButton={false}
            />
          </Grid>
          <Grid
            item
            xs
            sx={{
              width: "20rem",
              position: "relative",
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
            <Grid item xs md={8} sx={{ display: "flex", overflowY: "scroll" }}>
              <PresentationLoaderDetails
                onBack={clearPresentationId}
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
    </>
  )
}

export default OpenPresentationModal
