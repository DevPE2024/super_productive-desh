"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"

// Wrapper para Tabs que garante hidratação consistente
export const HydratedTabs = React.forwardRef<
  React.ElementRef<typeof Tabs>,
  React.ComponentPropsWithoutRef<typeof Tabs>
>(({ children, ...props }, ref) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="animate-pulse">
        <div className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 mb-2">
          <div className="h-7 w-20 bg-muted-foreground/20 rounded-md mr-2"></div>
          <div className="h-7 w-20 bg-muted-foreground/20 rounded-md"></div>
        </div>
        <div className="mt-2 h-32 bg-muted/50 rounded-md"></div>
      </div>
    )
  }

  return (
    <Tabs ref={ref} {...props}>
      {children}
    </Tabs>
  )
})

HydratedTabs.displayName = "HydratedTabs"

// Re-exportar outros componentes
export { TabsContent, TabsList, TabsTrigger }

