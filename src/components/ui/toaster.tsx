'use client';

import { Toaster as Sonner } from 'sonner';

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: 'bg-background text-foreground border-border',
          description: 'text-muted-foreground',
          actionButton: 'bg-primary text-primary-foreground',
          cancelButton: 'bg-muted text-muted-foreground',
          error: 'bg-destructive text-destructive-foreground',
          success: 'bg-green-600 text-white',
          warning: 'bg-yellow-600 text-white',
          info: 'bg-blue-600 text-white',
        },
      }}
    />
  );
}
