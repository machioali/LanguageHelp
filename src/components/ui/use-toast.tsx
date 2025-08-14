"use client"

import * as React from "react"
import { toast as hotToast } from 'react-hot-toast'

type ToastProps = {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}

export const toast = ({ title, description, variant = 'default' }: ToastProps) => {
  const message = title && description ? `${title}: ${description}` : title || description || ''
  
  if (variant === 'destructive') {
    hotToast.error(message)
  } else {
    hotToast.success(message)
  }
}

export function useToast() {
  return {
    toast,
  }
}
