"use client"

import * as React from "react"
import { ThemeProvider } from "./theme-provider"

export function Providers({ children, ...props }: any) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
            {children}
        </ThemeProvider>
    )
}
