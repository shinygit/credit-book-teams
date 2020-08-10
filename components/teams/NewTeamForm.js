import { mutate } from 'swr'
import { useForm } from 'react-hook-form'
import { createTeam } from '../../api/mutations'

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
    const newTeam = await createTeam(data)
    if (newTeam.error)
      setError('teamName', { type: 'manual', message: newTeam.error })
    if (newTeam.teamName) {
      reset()
      mutate('/api/teams')
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label> New team name:</label>
        <input
          type='text'
          placeholder='Best team name ever...'
          name='teamName'
          onFocus={(e) => clearErrors()}
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
