import { createJoinCode, setRole } from '../../../api/mutations'
import useSWR, { mutate } from 'swr'
import { useSession } from 'next-auth/client'

import { useRouter } from 'next/router'
const TeamMembers = () => {
  const [session, loading] = useSession()
  const router = useRouter()
  const { teamid } = router.query

  const { data: teamMembers, error: teamMembersError } = useSWR(
    teamid ? `/api/teams/${teamid}/members` : null
  )
  if (!teamMembers) return <div>Loading...</div>
  const isOwner =
    teamMembers.find((member) => member.id === session.userId).role === 'OWNER'
  const handleJoinCodeClick = async () => {
    const teamWithJoinCode = await createJoinCode(teamid)
    alert(
      `${teamWithJoinCode.joinCode}
      This code is one time use and expires in 5 minutes.`
    )
  }
  const handleAlterRole = async (id, currentRole) => {
    const newRole = await setRole(teamid, {
      userId: id,
      role: currentRole === 'USER' ? 'SHARED' : 'USER',
    })
    if (newRole) mutate(`/api/teams/${teamid}/members`)
  }
  const roles = {
    OWNER: 'Owner',
    USER: 'User',
    SHARED: 'Shared',
  }
  return (
    <div>
      <button onClick={handleJoinCodeClick}>Create Join Code</button>
      Members:
      {teamMembers.map((member) => (
        <div key={member.id}>
          {member.name} - {roles[member.role]}{' '}
          {isOwner && (
            <button
              onClick={() => handleAlterRole(member.id, member.role)}
              className='btn btn-white'
            >
              Alter Role
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
export default TeamMembers
