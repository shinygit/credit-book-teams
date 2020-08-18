import { mutate, cache } from 'swr'
import { useRouter } from 'next/router'
import { claimCredit } from '../../../api/mutations'

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/core'

const ClaimCredit = ({ credit }) => {
  const [isOpen, setIsOpen] = React.useState()
  const onClose = () => setIsOpen(false)
  const cancelRef = React.useRef()

  const router = useRouter()
  const { teamid } = router.query
  const handleClick = () => {
    setIsOpen(true)
  }
  const handleClaim = async () => {
    const claimedCredit = await claimCredit(teamid, credit.id)
    cache
      .keys()
      .filter((key) => key.startsWith(`arg@"/api/credits/${teamid}/search`))
      .forEach((key) => {
        mutate(
          key,
          (cachedCredits) => {
            return cachedCredits.map((cachedCredit) =>
              cachedCredit.id === credit.id
                ? {
                    ...cachedCredit,
                    claimedAt: claimedCredit.claimedAt,
                    claimedBy: { name: claimedCredit.claimedBy?.name },
                  }
                : cachedCredit
            )
          },
          false
        )
      })
  }

  if (credit.claimedAt)
    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='44'
        height='44'
        viewBox='0 0 24 24'
        strokeWidth='1.5'
        stroke='#2c3e50'
        fill='none'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path stroke='none' d='M0 0h24v24H0z' />
        <polyline points='9 11 12 14 20 6' />
        <path d='M20 12v6a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h9' />
      </svg>
    )
  return (
    <>
      <button onClick={handleClick}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='44'
          height='44'
          viewBox='0 0 24 24'
          strokeWidth='1.5'
          stroke='#2c3e50'
          fill='none'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path stroke='none' d='M0 0h24v24H0z' />
          <rect x='4' y='4' width='16' height='16' rx='2' />
        </svg>
      </button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Claim Credit
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <button
                className='btn btn-white'
                ref={cancelRef}
                onClick={onClose}
              >
                Cancel
              </button>
              <button className='ml-4 bg-gray-300 btn' onClick={onClose}>
                Claim
              </button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export default ClaimCredit
