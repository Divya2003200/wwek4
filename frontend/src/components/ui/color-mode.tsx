// "use client"

// import type { IconButtonProps, SpanProps } from "@chakra-ui/react"
// import { ClientOnly, IconButton, Skeleton, Span } from "@chakra-ui/react"
// import { ThemeProvider, useTheme } from "next-themes"
// import type { ThemeProviderProps } from "next-themes"
// import * as React from "react"
// import { LuMoon, LuSun } from "react-icons/lu"

// export interface ColorModeProviderProps extends ThemeProviderProps {}

// export function ColorModeProvider(props: ColorModeProviderProps) {
//   return (
//     <ThemeProvider attribute="class" disableTransitionOnChange {...props} />
//   )
// }

// export type ColorMode = "light" | "dark"

// export interface UseColorModeReturn {
//   colorMode: ColorMode
//   setColorMode: (colorMode: ColorMode) => void
//   toggleColorMode: () => void
// }

// export function useColorMode(): UseColorModeReturn {
//   const { resolvedTheme, setTheme } = useTheme()
//   const toggleColorMode = () => {
//     setTheme(resolvedTheme === "dark" ? "light" : "dark")
//   }
//   return {
//     colorMode: resolvedTheme as ColorMode,
//     setColorMode: setTheme,
//     toggleColorMode,
//   }
// }

// export function useColorModeValue<T>(light: T, dark: T) {
//   const { colorMode } = useColorMode()
//   return colorMode === "dark" ? dark : light
// }

// export function ColorModeIcon() {
//   const { colorMode } = useColorMode()
//   return colorMode === "dark" ? <LuMoon /> : <LuSun />
// }

// interface ColorModeButtonProps extends Omit<IconButtonProps, "aria-label"> {}

// export const ColorModeButton = React.forwardRef<
//   HTMLButtonElement,
//   ColorModeButtonProps
// >(function ColorModeButton(props, ref) {
//   const { toggleColorMode } = useColorMode()
//   return (
//     <ClientOnly fallback={<Skeleton boxSize="8" />}>
//       <IconButton
//         onClick={toggleColorMode}
//         variant="ghost"
//         aria-label="Toggle color mode"
//         size="sm"
//         ref={ref}
//         {...props}
//         css={{
//           _icon: {
//             width: "5",
//             height: "5",
//           },
//         }}
//       >
//         <ColorModeIcon />
//       </IconButton>
//     </ClientOnly>
//   )
// })

// export const LightMode = React.forwardRef<HTMLSpanElement, SpanProps>(
//   function LightMode(props, ref) {
//     return (
//       <Span
//         color="fg"
//         display="contents"
//         className="chakra-theme light"
//         colorPalette="gray"
//         colorScheme="light"
//         ref={ref}
//         {...props}
//       />
//     )
//   },
// )

// export const DarkMode = React.forwardRef<HTMLSpanElement, SpanProps>(
//   function DarkMode(props, ref) {
//     return (
//       <Span
//         color="fg"
//         display="contents"
//         className="chakra-theme dark"
//         colorPalette="gray"
//         colorScheme="dark"
//         ref={ref}
//         {...props}
//       />
//     )
//   },
// )


"use client"

import type { IconButtonProps, TextProps } from "@chakra-ui/react" // Change SpanProps to TextProps
import { IconButton, Skeleton, Text } from "@chakra-ui/react" // Change Span to Text
import { ThemeProvider, useTheme } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import * as React from "react"
import { LuMoon, LuSun } from "react-icons/lu"

export interface ColorModeProviderProps extends ThemeProviderProps {}

export function ColorModeProvider(props: ColorModeProviderProps) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange {...props} />
  )
}

export type ColorMode = "light" | "dark"

export interface UseColorModeReturn {
  colorMode: ColorMode
  setColorMode: (colorMode: ColorMode) => void
  toggleColorMode: () => void
}

export function useColorMode(): UseColorModeReturn {
  const { resolvedTheme, setTheme } = useTheme()
  const toggleColorMode = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }
  return {
    colorMode: resolvedTheme as ColorMode,
    setColorMode: setTheme,
    toggleColorMode,
  }
}

export function useColorModeValue<T>(light: T, dark: T) {
  const { colorMode } = useColorMode()
  return colorMode === "dark" ? dark : light
}

export function ColorModeIcon() {
  const { colorMode } = useColorMode()
  return colorMode === "dark" ? <LuMoon /> : <LuSun />
}

interface ColorModeButtonProps extends Omit<IconButtonProps, "aria-label"> {}

export const ColorModeButton = React.forwardRef<
  HTMLButtonElement,
  ColorModeButtonProps
>(function ColorModeButton(props, ref) {
  const { toggleColorMode } = useColorMode()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    // Ensures the component is rendered only on the client
    setMounted(true)
  }, [])

  if (!mounted) {
    // Show a fallback loading skeleton until the component is mounted
    return <Skeleton boxSize="8" />
  }

  return (
    <IconButton
      onClick={toggleColorMode}
      variant="ghost"
      aria-label="Toggle color mode"
      size="sm"
      ref={ref}
      {...props}
      css={{
        _icon: {
          width: "5",
          height: "5",
        },
      }}
    >
      <ColorModeIcon />
    </IconButton>
  )
})

export const LightMode = React.forwardRef<HTMLSpanElement, TextProps>(
  function LightMode(props, ref) {
    return (
      <Text
        color="fg"
        display="contents"
        className="chakra-theme light"
        colorPalette="gray"
        colorScheme="light"
        ref={ref}
        {...props}
      />
    )
  },
)

export const DarkMode = React.forwardRef<HTMLSpanElement, TextProps>(
  function DarkMode(props, ref) {
    return (
      <Text
        color="fg"
        display="contents"
        className="chakra-theme dark"
        colorPalette="gray"
        colorScheme="dark"
        ref={ref}
        {...props}
      />
    )
  },
)
