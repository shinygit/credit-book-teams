import { useSession, signIn, signOut } from 'next-auth/client'
const NavBar = () => {
  const [session, loading] = useSession()
  if (loading) return 'Loading..'
  if (session) {
    return (
      <div className='flex justify-between'>
        <div></div>
        <div>Welcome {session.user.name}</div>
        <button onClick={signOut}>Sign out</button>
      </div>
    )
  }
  if (!session) {
    return <button onClick={signIn}>Sign in</button>
  }
}
export default NavBar
