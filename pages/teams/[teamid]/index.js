import { useRouter } from 'next/router'
import useSWR from 'swr'
import ListCredits from '../../../components/credits/ListCredits'
import AddCredit from '../../../components/credits/add_credit'

const TeamPage = () => {
  const router = useRouter()
  const { teamid } = router.query
  const { data: teamData, error: teamError } = useSWR(
    teamid ? `/api/teams/${teamid}` : null
  )
  const { data: creditsData, error: creditsError } = useSWR(
    teamid ? `/api/credits/${teamid}/unclaimed` : null
  )
  if (!teamData) return <div>loading...</div>
  return (
    <div>
      Team: {teamData.teamName}
      <AddCredit teamId={teamid} />
      <ListCredits credits={creditsData} />
    </div>
  )
}
export default TeamPage
