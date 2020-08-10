import { mutate } from 'swr'
import { useForm } from 'react-hook-form'
import { joinTeam } from '../../api/mutations'

export default function TeamPage() {
  const {
    register,
    handleSubmit,
    setError,
    errors,
    clearErrors,
    reset,
  } = useForm()
  const onSubmit = async (data) => {
    const joinedTeam = await joinTeam(data)
    if (joinedTeam.error)
      setError('server', { type: 'manual', message: joinedTeam.error })
    if (joinedTeam.teamName) {
      reset()
      mutate('/api/teams')
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label> Team Name:</label>
        <input
          type='text'
          placeholder='Best team name ever...'
          name='teamName'
          onFocus={(e) => clearErrors()}
          ref={register({
            required: { value: true, message: 'A team must have a name.' },
          })}
        />
        {errors.teamName && <p>{errors.teamName.message}</p>}
        <label> Join Code:</label>
        <input
          type='text'
          placeholder='Super Secret!'
          name='joinCode'
          onFocus={(e) => clearErrors()}
          ref={register({
            required: {
              value: true,
              message: 'To join a team you must have a join code.',
            },
          })}
        />
        {errors.joinCode && <p>{errors.joinCode.message}</p>}
        <input type='submit' />
        {errors.server && <p>{errors.server.message}</p>}
      </form>
    </div>
  )
}
