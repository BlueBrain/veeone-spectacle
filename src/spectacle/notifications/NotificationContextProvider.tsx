import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"
import { Snackbar } from "@mui/material"
import MuiAlert, { AlertProps } from "@mui/material/Alert"
import { AlertColor } from "@mui/material/Alert/Alert"

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

interface NotificationContextProviderProps {
  children: ReactNode
}

interface NotificationContextProps {
  success(message: string): void
  info(message: string): void
  error(message: string): void
  warning(message: string): void
}

const NotificationContext = createContext<NotificationContextProps>({
  success(message: string) {},
  warning(message: string) {},
  info(message: string) {},
  error(message: string) {},
})

export const useNotifications = () => useContext(NotificationContext)

const NotificationContextProvider: React.FC<NotificationContextProviderProps> = ({
  children,
}) => {
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false)
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>("info")

  const messageSuccess = useCallback((message: string) => {
    setSnackbarMessage(message)
    setSnackbarSeverity("success")
    setIsSnackbarOpen(true)
  }, [])

  const messageInfo = useCallback((message: string) => {
    setSnackbarMessage(message)
    setSnackbarSeverity("info")
    setIsSnackbarOpen(true)
  }, [])

  const messageWarning = useCallback((message: string) => {
    setSnackbarMessage(message)
    setSnackbarSeverity("warning")
    setIsSnackbarOpen(true)
  }, [])

  const messageError = useCallback((message: string) => {
    setSnackbarMessage(message)
    setSnackbarSeverity("error")
    setIsSnackbarOpen(true)
  }, [])

  const providerValue = useMemo<NotificationContextProps>(
    () => ({
      error: messageError,
      info: messageInfo,
      success: messageSuccess,
      warning: messageWarning,
    }),
    [messageSuccess, messageWarning, messageInfo, messageError]
  )

  return (
    <NotificationContext.Provider value={providerValue}>
      {children}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={isSnackbarOpen}
        autoHideDuration={5000}
        onClose={() => setIsSnackbarOpen(false)}
        message={snackbarMessage}
      >
        <Alert severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  )
}

export default NotificationContextProvider
