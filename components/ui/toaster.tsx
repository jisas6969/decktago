'use client'

import { useToast } from '@/hooks/use-toast'
import {
  Toast,
  ToastDescription,
  ToastProvider,
  ToastViewport,
} from '@/components/ui/toast'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ id, description, ...props }) => (
        <Toast key={id} {...props}>
          {description && (
            <ToastDescription>{description}</ToastDescription>
          )}
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}