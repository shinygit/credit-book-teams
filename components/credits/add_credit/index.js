import { useForm } from 'react-hook-form'
import { createCredit } from '../../../api/mutations'
import { mutate } from 'swr'
import { useState } from 'react'
import Modal from 'react-modal'
const AddCredit = ({ teamId }) => {
  Modal.setAppElement('#__next')
  const { register, handleSubmit, errors } = useForm()
  const onSubmit = async (data) => {
    data.dollarValue = parseInt(data.dollarValue)
    const newCredit = await createCredit(teamId, data)
    if (newCredit.error) setError({ type: 'manual', message: newTeam.error })
    if (newCredit.id) mutate(`/api/credits/${teamId}/unclaimed`)
  }
  console.log(errors)
  const [modalIsOpen, setIsOpen] = useState(false)
  function openModal() {
    setIsOpen(true)
  }
  function closeModal() {
    setIsOpen(false)
  }

  return (
    <div>
      <button onClick={openModal}>Add Credit</button>
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
              ref={register}
            />
          </label>
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
          <input type='submit' />
          <button onClick={closeModal}>Close</button>
        </form>
      </Modal>
    </div>
  )
}
export default AddCredit
