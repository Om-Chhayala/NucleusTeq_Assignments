import { useState, useEffect } from "react"
import "./toast.css"

const Toast = ({ message, type, duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      if (onClose) setTimeout(onClose, 300) // Allow animation to complete
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div className={`toast ${type} ${visible ? "show" : "hide"}`}>
      <div className="toast-content">
        <span className="toast-message">{message}</span>
      </div>
    </div>
  )
}

export default Toast

