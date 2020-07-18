import '../styles/index.css'

import Head from 'next/head'
import { Provider } from 'next-auth/client'

import { SWRConfig } from 'swr'
import NavBar from '../components/navbar/NavBar'

function MyApp({ Component, pageProps }) {
  const { session } = pageProps
  return (
    <Provider session={session}>
      <SWRConfig
        value={{
          fetcher: (...args) => fetch(...args).then((res) => res.json()),
        }}
      >
        <div>
          <Head>
            <title>Credit Book</title>
            <link rel='icon' href='/favicon.ico' />
          </Head>
          <NavBar />
          <Component {...pageProps} />
        </div>
      </SWRConfig>
    </Provider>
  )
}

export default MyApp
