"use client"

import { useState, useEffect } from "react"
import Toast from "./toast"
import "./toast-container.css"

// Global toast queue to handle toasts from anywhere
let toastQueue = []
let toastListeners = []

// Function to notify all listeners about toast queue changes
const notifyListeners = () => {
  toastListeners.forEach((listener) => listener([...toastQueue]))
}

// Helper function to show toasts from anywhere in the app
export const showToast = (message, type = "success", duration = 3000) => {
  const id = Date.now()
  toastQueue.push({ id, message, type, duration })
  notifyListeners()

  // Auto remove toast after duration + animation time
  setTimeout(() => {
    toastQueue = toastQueue.filter((toast) => toast.id !== id)
    notifyListeners()
  }, duration + 300)

  // For debugging
  console.log(`Toast shown: ${message} (${type})`)
}

const ToastContainer = () => {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    // Register as a listener for toast queue changes
    const listener = (updatedQueue) => {
      setToasts(updatedQueue)
    }

    toastListeners.push(listener)

    // Initial state
    setToasts([...toastQueue])

    return () => {
      // Clean up listener on unmount
      toastListeners = toastListeners.filter((l) => l !== listener)
    }
  }, [])

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} type={toast.type} duration={toast.duration} />
      ))}
    </div>
  )
}

export default ToastContainer

