import { createContext, useContext, useState, useCallback } from "react"

const ToastContext = createContext({})
export const useToast = () => useContext(ToastContext)

export function ToastProvider({ children }) {

  const [toast, setToast] = useState(null)

  const showToast = useCallback((message) => {
    setToast(message)
    setTimeout(() => setToast(null), 2500)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && <div className="toast">{toast}</div>}
    </ToastContext.Provider>
  )

}
