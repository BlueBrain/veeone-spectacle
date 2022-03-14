import React, { FC, useContext, useEffect, useMemo, useState } from "react"
import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material"
import SpectacleContext from "../core/spectacle/SpectacleContext"
import { SpectaclePresentation } from "../core/types"
import { friendlyDisplayDateTime } from "../common/datetime"
import { Crop32Rounded } from "@mui/icons-material"

interface PresentationLoaderDetailsProps {
  presentationId: string
}

export const PresentationLoaderDetails: FC<PresentationLoaderDetailsProps> = ({
  presentationId,
}) => {
  const spectacleContext = useContext(SpectacleContext)
  const [
    presentationData,
    setPresentationData,
  ] = useState<SpectaclePresentation>(null)

  useEffect(() => {
    async function loadPresentationData() {
      const data = await spectacleContext.openPresentation.load(presentationId)
      console.debug("Load presentation data", data)
      setPresentationData(data)
    }
    void loadPresentationData()
  }, [presentationId, spectacleContext.openPresentation])

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

  const aspectRatio = useMemo(
    () =>
      presentationData
        ? Math.round(
            (10 * presentationData.meta.viewport.width) /
              presentationData.meta.viewport.height
          ) / 10
        : 0,
    [presentationData]
  )

  return isLoading || !presentationData ? (
    <CircularProgress />
  ) : (
    <Box
      sx={{
        marginLeft: "1rem",
        display: "flex",
        flex: "1",
        flexDirection: "column",
      }}
    >
      <Typography variant={"h4"} mb={2}>
        {presentationData.name}
      </Typography>
      <Table sx={{ width: "100%" }} size={"small"}>
        <TableBody>
          <TableRow>
            <TableCell colSpan={2}>
              <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                {sceneSummaries.map((item, i) => {
                  return (
                    <Box
                      key={i}
                      sx={{
                        background: theme => theme.palette.secondary.pale,
                        opacity: 1,
                        padding: "1rem 0.5rem",
                        margin: ".2rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        aspectRatio: `${aspectRatio}`,
                      }}
                    >
                      {item.frameCount} &times;
                      <Crop32Rounded />
                    </Box>
                  )
                })}
              </Box>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Screen size</TableCell>
            <TableCell>
              {presentationData.meta.viewport.width}
              &times;
              {presentationData.meta.viewport.height}({aspectRatio})
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Created</TableCell>
            <TableCell>
              {friendlyDisplayDateTime(presentationData.createdAt)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Last updated</TableCell>
            <TableCell>
              {friendlyDisplayDateTime(presentationData.updatedAt)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>
              <Box sx={{ fontSize: "0.7rem" }}>{presentationData.id}</Box>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  )
}
