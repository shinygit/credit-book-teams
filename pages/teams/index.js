import useSWR, { mutate } from 'swr'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { createTeam } from '../../api/mutations'

export default function TeamPage() {
  const { data: teamsList, error } = useSWR('/api/teams')
  const { register, handleSubmit, setError, errors, clearErrors } = useForm()
  const onSubmit = async (data) => {
    const newTeam = await createTeam(data)
    if (newTeam.error)
      setError('teamName', { type: 'manual', message: newTeam.error })
    if (newTeam.teamName) mutate('/api/teams')
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
                <Link href='/teams/[teamid]' as={`/teams/${team.id}`}>
                  {team.teamName}
                </Link>
              )
            })}
          </>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label> New team name:</label>
        <input
          type='text'
          placeholder='Best team name ever...'
          name='teamName'
          ref={register({
            required: { value: true, message: 'A team must have a name.' },
            minLength: {
              value: 5,
              message: 'A team name must be at least 5 characters long.',
            },
          })}
        />
        {errors.teamName && <p>{errors.teamName.message}</p>}
        <input type='submit' />
      </form>
    </div>
  )
}
