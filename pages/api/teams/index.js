import getUserIdFromReq from '../../../utils/getUserIdFromReq'
import prisma from '../../../prisma/prisma'

const handler = async (req, res) => {
  try {
    const userId = await getUserIdFromReq(req, res)
    if (!userId) return res.end()
    if (req.method === 'POST') {
      const userTeam = await prisma.userTeam.create({
        data: {
          roll: 'ADMIN',
          team: { create: { teamName: req.body.teamName } },
          user: { connect: { id: userId } },
        },
        select: {
          team: true,
        },
      })
      return res.json(userTeam.team)
    }
  } catch (e) {
    console.log(e)
  } finally {
    await prisma.disconnect()
  }
}
export default handler
