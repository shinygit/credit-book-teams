import { createJoinCode } from '../../../api/mutations'
import useSWR from 'swr'

import { useRouter } from 'next/router'
const TeamMembers = () => {
  const router = useRouter()
  const { teamid } = router.query
  const { data: teamMembers = [], error: teamMembersError } = useSWR(
    teamid ? `/api/teams/${teamid}/members` : null
  )
  const handleJoinCodeClick = async () => {
    const teamWithJoinCode = await createJoinCode(teamid)
    alert(
      `${teamWithJoinCode.joinCode}
      This code is one time use and expires in 5 minutes.`
    )
  }
  return (
    <div>
      <button onClick={handleJoinCodeClick}>Create Join Code</button>
      Members:
      {teamMembers.map((member) => (
        <div key={member.id}>{member.name}</div>
      ))}
    </div>
  )
}
export default TeamMembers
