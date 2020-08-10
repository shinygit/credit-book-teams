import { useState } from 'react'
import { useRouter } from 'next/router'
import { useSession, signOut } from 'next-auth/client'
import Link from 'next/link'
import useSWR from 'swr'

import { Collapse, Flex, IconButton, Text, Button } from '@chakra-ui/core'
import { AiOutlineDownSquare, AiOutlineUpSquare } from 'react-icons/ai'

const NavBar = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  const [session, loading] = useSession()
  const router = useRouter()
  const { teamid } = router.query
  const { data: teamData, error: teamError } = useSWR(
    teamid ? `/api/teams/${teamid}` : null
  )
  if (router.pathname === '/') return null
  if (loading) return 'Loading...'

  const handleSignOutClick = () => {
    signOut()
  }
  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }
  if (session) {
    return (
      <>
        <div className='flex h-10 mb-1 justify-between align-center'>
          {teamData && <p className='text-2xl'>{teamData.teamName}</p>}
          {isExpanded ? (
            <button
              className='ml-auto'
              aria-label='Collapse Menu'
              onClick={handleToggle}
            >
              <AiOutlineUpSquare size='2.5em' />
            </button>
          ) : (
            <button
              className='ml-auto'
              aria-label='Expand Menu'
              onClick={handleToggle}
            >
              <AiOutlineDownSquare size='2.5em' />
            </button>
          )}
        </div>
        <Collapse isOpen={isExpanded}>
          <div className='flex mb-2 h-10 justify-between align-center'>
            <Link href='/teams'>
              <button
                className='btn btn-white'
                disabled={router.pathname === '/teams'}
              >
                <a>Switch Teams</a>
              </button>
            </Link>
            <div>{session.user.name}</div>
            <button className='btn btn-white' onClick={signOut}>
              Sign Out
            </button>
          </div>
        </Collapse>
      </>
    )
  }
}
export default NavBar
