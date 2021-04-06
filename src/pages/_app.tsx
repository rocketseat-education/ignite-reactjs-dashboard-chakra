import { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClientProvider } from 'react-query'
import { theme } from '../styles/theme'
import { ReactQueryDevtools } from 'react-query/devtools'
import { makeServer } from "../mirage"

import { SidebarDrawerProvider } from '../contexts/SidebarDrawerContext'
import { queryClient } from '../services/queryClient'

if (process.env.NODE_ENV === "development") {
  makeServer({ environment: "development" })
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <SidebarDrawerProvider>
          <Component {...pageProps} />
        </SidebarDrawerProvider>
      </ChakraProvider>

      <ReactQueryDevtools initialIsOpen position="top-left" />
    </QueryClientProvider>
  )
}

export default MyApp
