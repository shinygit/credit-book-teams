import { useForm } from 'react-hook-form'
import { createCredit } from '../../../api/mutations'
import { mutate, cache } from 'swr'
import { useState } from 'react'
import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/core'
import { useRole } from '../../../hooks/useRole'

const AddCredit = ({ teamId }) => {
  const role = useRole()
  const { register, handleSubmit, setError, errors } = useForm()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const onSubmit = async (data) => {
    data.dollarValue = parseInt(data.dollarValue)
    const newCredit = await createCredit(teamId, data)
    if (newCredit.error)
      setError('shared', { type: 'manual', message: newCredit.error })
    if (newCredit.id) {
      cache
        .keys()
        .filter((key) => {
          return key.startsWith(
            `arg@"many"@"arg@"/api/credits/${teamId}/search`
          )
        })
        .forEach((key) => {
          mutate(key)
        }) /* , (cachedCredits) => {
            return [...cachedCredits, newCredit]
          })
        }, false) */
      onClose()
    }
  }
  return (
    <>
      <Button variant='outline' bg='White' colorScheme='Black' onClick={onOpen}>
        Add Credit
      </Button>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        contentLabel='Add Credit Modal'
      >
        <ModalOverlay>
          <ModalContent className='p-3 border-2 border-black shadow-xl'>
            <ModalHeader className='mx-auto'>ADD A CREDIT</ModalHeader>
            <form className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
              <label className='flex items-center justify-between text-lg'>
                Name
                <input
                  type='text'
                  placeholder='Name'
                  name='name'
                  ref={register({ required: true, maxLength: 50 })}
                  className='m-1 input'
                />
              </label>
              <label className='flex items-center justify-between text-lg'>
                Phone Number
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
                  className='m-1 input'
                />
              </label>
              {errors.phone?.type === 'pattern' && (
                <p className='text-red-500'>{errors.phone.message}</p>
              )}
              <label className='flex items-center justify-between text-lg'>
                Dollar Value
                <input
                  type='number'
                  placeholder='Dollar Value'
                  name='dollarValue'
                  ref={register}
                  className='m-1 input'
                />
              </label>
              <label className='flex items-center justify-between text-lg'>
                Item Value
                <input
                  type='text'
                  placeholder='Item Value'
                  name='itemValue'
                  ref={register}
                  className='m-1 input'
                />
              </label>
              <label className='flex items-center justify-between text-lg'>
                Reason For Credit
                <input
                  type='text'
                  placeholder='Reason For Credit'
                  name='reason'
                  ref={register}
                  className='m-1 input'
                />
              </label>
              {role === 'SHARED' ? (
                <label className='flex items-center justify-between text-lg'>
                  Written By
                  <input
                    type='text'
                    placeholder='Written By?'
                    name='writtenOnSharedBy'
                    ref={register}
                    className='m-1 input'
                  />
                </label>
              ) : null}
              <div className='flex justify-between mt-4'>
                <button className='btn' onClick={onClose}>
                  Cancel
                </button>
                <button className='btn btn-white' type='submit'>
                  Save
                </button>
              </div>
            </form>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  )
}
export default AddCredit
