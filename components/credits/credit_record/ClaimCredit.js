import { mutate, cache } from 'swr'
import { useRouter } from 'next/router'
import { claimCredit } from '../../../api/mutations'

import { useRole } from '../../../hooks/useRole'

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
  const role = useRole()

  const [isOpen, setIsOpen] = React.useState()
  const [sharedClaimer, setSharedClaimer] = React.useState('')
  const [isError, setIsError] = React.useState('')
  const cancelRef = React.useRef()

  const router = useRouter()
  const { teamid } = router.query
  const handleClick = () => {
    role === 'SHARED' ? setIsError('Claimer can not be blank.') : null
    setIsOpen(true)
  }
  const handleClaim = async () => {
    if (role === 'SHARED' && sharedClaimer === '') {
      setIsError('Claimer can not be blank.')
      return
    }
    const claimedCredit = await claimCredit(teamid, credit.id, {
      claimedOnSharedBy: sharedClaimer,
    })
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
                    claimedOnSharedBy: sharedClaimer,
                  }
                : cachedCredit
            )
          },
          false
        )
      })
    setIsOpen(false)
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
        onClose={() => setIsOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Claim Credit
            </AlertDialogHeader>
            <AlertDialogBody>
              <div>Are you sure? You can't undo this action afterwards.</div>
              {role === 'SHARED' ? (
                <div>
                  Who is claiming?{' '}
                  <input
                    className='border border-black'
                    value={sharedClaimer}
                    onChange={(e) => {
                      setSharedClaimer(e.target.value)
                      setIsError('')
                    }}
                  />
                </div>
              ) : null}
              <div className='text-red-500'>{isError}</div>
            </AlertDialogBody>

            <AlertDialogFooter>
              <button
                className='btn btn-white'
                ref={cancelRef}
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button className='ml-4 bg-gray-300 btn' onClick={handleClaim}>
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
