import { useForm } from 'react-hook-form'
import { createCredit } from '../../../api/mutations'
import { mutate, cache } from 'swr'
import { useState } from 'react'
import { Button } from '@chakra-ui/core'
import Modal from 'react-modal'
import { useRole } from '../../../hooks/useRole'

const AddCredit = ({ teamId }) => {
  const role = useRole()
  Modal.setAppElement('#__next')
  const { register, handleSubmit, setError, errors } = useForm()
  const onSubmit = async (data) => {
    data.dollarValue = parseInt(data.dollarValue)
    const newCredit = await createCredit(teamId, data)
    if (newCredit.error)
      setError('shared', { type: 'manual', message: newCredit.error })
    if (newCredit.id) {
      cache
        .keys()
        .filter((key) => key.startsWith(`arg@"/api/credits/${teamId}/search`))
        .forEach((key) => {
          mutate(key, (cachedCredits) => {
            return [...cachedCredits, newCredit]
          })
        }, false)
      closeModal()
    }
  }
  const [modalIsOpen, setIsOpen] = useState(false)
  function openModal() {
    setIsOpen(true)
  }
  function closeModal() {
    setIsOpen(false)
  }
  return (
    <div>
      <Button
        variant='outline'
        bg='White'
        colorScheme='Black'
        onClick={openModal}
      >
        Add Credit
      </Button>
      <Modal isOpen={modalIsOpen} contentLabel='Add Item Modal'>
        <form className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
          <label>
            Name:
            <input
              type='text'
              placeholder='Name'
              name='name'
              ref={register({ required: true, maxLength: 50 })}
            />
          </label>
          <label>
            Phone Number:
            <input
              type='tel'
              placeholder='Phone Number'
              name='phone'
              ref={register({
                pattern: {
                  value: /^[0-9]+$/,
                  message: 'This is not the 1930s',
                },
              })}
            />
          </label>
          {errors.phone?.type === 'pattern' && (
            <p className='text-red-500'>{errors.phone.message}</p>
          )}
          <label>
            Dollar Value:
            <input
              type='number'
              placeholder='Dollar Value'
              name='dollarValue'
              ref={register}
            />
          </label>
          <label>
            Item Value:
            <input
              type='text'
              placeholder='Item Value'
              name='itemValue'
              ref={register}
            />
          </label>
          <label>
            Reason For Credit:
            <input
              type='text'
              placeholder='Reason For Credit'
              name='reason'
              ref={register}
            />
          </label>
          {role === 'SHARED' ? (
            <label>
              Written By:
              <input
                type='text'
                placeholder='Written By?'
                name='writtenOnSharedBy'
                ref={register}
              />
            </label>
          ) : null}
          <input type='submit' />
          <button onClick={closeModal}>Close</button>
        </form>
      </Modal>
    </div>
  )
}
export default AddCredit
