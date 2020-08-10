import useSWR from 'swr'
import { useRouter } from 'next/router'
import { isServer } from '../utils'
import { useSession, signIn } from 'next-auth/client'

const Index = () => {
  const router = useRouter()
  const { data: teamsList, error } = useSWR('/api/teams')
  if (!teamsList) return null
  if (teamsList.error && router.pathname !== '/') {
    return null
  }
  if (!isServer() && teamsList && !teamsList.error && router.pathname === '/') {
    const defaultTeam = teamsList.find((team) => {
      return team.isDefaultTeam === true
    })
    defaultTeam
      ? router.push('/teams/[teamid]', `/teams/${defaultTeam.id}`)
      : router.push('/teams', '/teams')
  }
  return null
}
export default Index
