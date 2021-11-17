import { styled } from "@mui/material/styles"
import { CircularProgress } from "@mui/material"
import React from "react"

const StyledFileSystemBusyIndicator = styled("div")(({ theme }) => ({
  width: "100%",
  height: "100%",
  top: 0,
  left: 0,
}))

interface FileSystemBusyIndicatorProps {}

const FileSystemBusyIndicator: React.FC<FileSystemBusyIndicatorProps> = () => {
  return (
    <StyledFileSystemBusyIndicator>
      <CircularProgress
        sx={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transition: "translate(-50%, -50%)",
        }}
      />
    </StyledFileSystemBusyIndicator>
  )
}

export default FileSystemBusyIndicator
