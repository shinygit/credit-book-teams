import { useSession, signIn } from 'next-auth/client'

import { Flex, Button, Box } from '@chakra-ui/core'

const Index = () => {
  return (
    <>
      <Flex h='50px' justify='space-between' align='center'>
        <div></div>
        <Button
          onClick={signIn}
          variant='outline'
          bg='white'
          colorScheme='white'
        >
          Sign In
        </Button>
      </Flex>
      <Flex justify='center'>
        <Flex fontSize='5xl' flexDirection='column' align='flex-end'>
          <Box fontWeight='bold'>CREDIT BOOK</Box>
          <Box>Teams!</Box>
        </Flex>
      </Flex>
    </>
  )
}
export default Index
