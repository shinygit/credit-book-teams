import { providers, signIn, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'

const SignIn = ({ providers }) => {
  const [session, loading] = useSession()
  const router = useRouter()
  if (session) {
    router.push('/')
    return null
  }
  return (
    <>
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button onClick={() => signIn(provider.id)}>
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </>
  )
}

export async function getServerSideProps(context) {
  return {
    props: { providers: await providers(context) },
  }
}

export default SignIn
