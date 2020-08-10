import { useState } from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import Credits from '../../../components/credits/'
import AddCredit from '../../../components/credits/add_credit'
import NextLink from 'next/link'
import { Flex, Link, Button } from '@chakra-ui/core'

const TeamPage = () => {
  const router = useRouter()
  const { teamid } = router.query
  const { data: teamData, error: teamError } = useSWR(
    teamid ? `/api/teams/${teamid}` : null
  )

  if (!teamData) return <div>loading...</div>
  return (
    <Flex flexDirection='column'>
      <Flex mb={2} justify='space-between'>
        <Button variant='outline' bg='white' colorScheme='white'>
          <NextLink
            href='/teams/[teamid]/members'
            as={`/teams/${teamid}/members`}
          >
            <a>Manage Members</a>
          </NextLink>
        </Button>
        <AddCredit teamId={teamid} />
      </Flex>
      <Credits teamid={teamid} />
    </Flex>
  )
}
export default TeamPage
