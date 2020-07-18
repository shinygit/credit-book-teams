import getUserIdFromReq from '../../../utils/getUserIdFromReq'
import prisma from '../../../prisma/prisma'

const handler = async (req, res) => {
  try {
    const userId = await getUserIdFromReq(req, res)
    if (!userId) return res.end()

    if (req.method === 'GET') {
      // return all claimed credits
    }
  } catch (e) {
    console.log(e)
  } finally {
    await prisma.disconnect()
  }
}
export default handler
