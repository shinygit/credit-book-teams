import Head from 'next/head'
import '../styles/index.css'
import { Provider } from 'next-auth/client'
import { SWRConfig } from 'swr'
import NavBar from '../components/navbar/NavBar'
import Redirect from '../components/Redirect'
import { ChakraProvider, CSSReset } from '@chakra-ui/core'
import theme from '@chakra-ui/theme'

import useSWR from 'swr'
import { getSession, signIn } from 'next-auth/client'

function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <ChakraProvider theme={theme}>
        <SWRConfig
          value={{
            fetcher: (...args) => fetch(...args).then((res) => res.json()),
          }}
        >
          <Redirect />
          <Head>
            <title>Credit Book</title>
            <link rel='icon' href='/favicon.ico' />
          </Head>
          <div className='min-h-screen p-2 bg-gray-100'>
            <div className='max-w-4xl mx-auto'>
              <NavBar />
              <Component {...pageProps} />
            </div>
          </div>
        </SWRConfig>
      </ChakraProvider>
    </Provider>
  )
}
export default MyApp
