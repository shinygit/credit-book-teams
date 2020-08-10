import useSWR, { mutate } from 'swr'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { createTeam, setDefaultTeam } from '../../api/mutations'
import JoinTeamForm from '../../components/teams/JoinTeamForm'
import NewTeamForm from '../../components/teams/NewTeamForm'

import { Checkbox } from '@chakra-ui/core'

export default function TeamPage() {
  const { data: teamsList, error } = useSWR('/api/teams')
  const {
    register,
    handleSubmit,
    setError,
    errors,
    clearErrors,
    reset,
  } = useForm()
  const onSubmit = async (data) => {
    const newTeam = await createTeam(data)
    if (newTeam.error)
      setError('teamName', { type: 'manual', message: newTeam.error })
    if (newTeam.teamName) {
      reset()
      mutate('/api/teams')
    }
  }

  const handleCheckBoxClick = async (teamId) => {
    const newDefaultTeam = await setDefaultTeam(teamId)

    if (newDefaultTeam.id) {
      mutate('/api/teams')
    }
  }

  if (!teamsList) return <div>loading...</div>

  return (
    <div>
      <div>
        {teamsList.length < 1 ? (
          <p>Create a team or join a team.</p>
        ) : (
          <>
            <p>Current teams:</p>
            {teamsList.map((team) => {
              return (
                <div key={team.id}>
                  <Link href='/teams/[teamid]' as={`/teams/${team.id}`}>
                    <a>{team.teamName}</a>
                  </Link>
                  <Checkbox
                    onChange={(e) => handleCheckBoxClick(team.id)}
                    size='lg'
                    isChecked={team.isDefaultTeam}
                  />
                </div>
              )
            })}
          </>
        )}
      </div>
      <NewTeamForm />
      <JoinTeamForm />
    </div>
  )
}
