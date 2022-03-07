import React, { FC, useContext, useEffect, useMemo, useState } from "react"
import {
  Box,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material"
import SpectacleContext from "../core/spectacle/SpectacleContext"
import { SpectaclePresentation } from "../core/types"
import { friendlyDisplayDateTime } from "../common/datetime"

interface PresentationLoaderDetailsProps {
  presentationId: string
  onLoadRequest: (event) => void
}

export const PresentationLoaderDetails: FC<PresentationLoaderDetailsProps> = ({
  presentationId,
  onLoadRequest,
}) => {
  const spectacleContext = useContext(SpectacleContext)
  const [
    presentationData,
    setPresentationData,
  ] = useState<SpectaclePresentation>(null)

  useEffect(() => {
    async function loadPresentationData() {
      const data = await spectacleContext.loadPresentation.load(presentationId)
      console.debug("Load presentation data", data)
      setPresentationData(data)
    }
    void loadPresentationData()
  }, [presentationId, spectacleContext.loadPresentation])

  const isLoading = presentationData === null

  const sceneCount = useMemo(
    () =>
      presentationData !== null ? presentationData.scenes.sceneOrder.length : 0,
    [presentationData]
  )

  const sceneSummaries = useMemo(() => {
    return presentationData !== null
      ? Object.keys(presentationData.scenes.scenes).map((sceneKey, index) => {
          return {
            frameCount: Object.keys(
              presentationData.scenes.scenes[sceneKey].frames
            ).length,
          }
        })
      : []
  }, [presentationData])

  return isLoading ? (
    <CircularProgress />
  ) : (
    <Box>
      <h2>{presentationData.name}</h2>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Created at</TableCell>
            <TableCell>
              {friendlyDisplayDateTime(presentationData.createdAt)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Last updated at</TableCell>
            <TableCell>
              {friendlyDisplayDateTime(presentationData.updatedAt)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Scenes</TableCell>
            <TableCell>
              {sceneSummaries.map((item, i) => {
                return <div key={i}>Frames: {item.frameCount}</div>
              })}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Button onClick={onLoadRequest} variant={"contained"} fullWidth={true}>
        Open presentation
      </Button>
    </Box>
  )
}
