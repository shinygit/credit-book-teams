import { getSession } from 'next-auth/client'
import prisma from '../prisma/prisma'
const getUserIdFromReq = async (req, res) => {
  try {
    const session = await getSession({ req, res })
    if (!session) throw 'Not logged in.'
    const foundSession = await prisma.session.findOne({
      where: { accessToken: session.accessToken },
    })
    if (!foundSession) throw 'no session'
    return foundSession.userId
  } catch {
    return res.json({ error: 'Not logged in.' })
  } finally {
    await prisma.disconnect()
  }
}
export default getUserIdFromReq
