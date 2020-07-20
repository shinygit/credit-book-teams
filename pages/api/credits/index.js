import addUserToReq from '../../../middleware/addUserIdToReq'

import prisma from '../../../prisma/prisma'

const handler = async (req, res) => {
  try {
    await addUserToReq(req)
    console.log(req.userId)
    if (req.method === 'POST') {
    }
  } catch (e) {
    console.log(e)
  } finally {
    await prisma.disconnect()
  }
}
export default handler
