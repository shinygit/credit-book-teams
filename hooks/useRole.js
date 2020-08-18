import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import useSWR from 'swr'

const useRole = () => {
  const [session, loading] = useSession()
  const router = useRouter()
  const { teamid } = router.query

  const { data: teamMembers, error: teamMembersError } = useSWR(
    teamid ? `/api/teams/${teamid}/members` : null
  )
  if (loading) return null
  if (!teamMembers) return null

  return teamMembers.find((member) => member.id === session.userId).role
}
export { useRole }
