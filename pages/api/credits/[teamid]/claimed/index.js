import prisma from '../../../../../prisma/prisma'
import { addUserIdToReq } from '../../../../../middleware/addUserIdToReq'
import { belongsToTeamAs } from '../../../../../utils/authorization/belongsToTeamAs'

const handler = async (req, res) => {
  try {
    await addUserIdToReq(req)
    if (!req.userId) return res.status(401).json({ error: 'Not logged in' })
    const belongsToTeam = await belongsToTeamAs(req.userId, req.query.teamid)
    if (!belongsToTeam)
      return res.json({ error: 'You do not belong to this team.' })
    if (req.method === 'GET') {
      const credits = await prisma.credit.findMany({
        where: {
          teamId: req.query.teamid,
          claimedAt: { not: null },
        },
        include: {
          claimedBy: { select: { name: true } },
          createdBy: { select: { name: true } },
        },
      })
      return res.json(credits)
    }
  } catch (e) {
    console.log(e)
  } finally {
    await prisma.$disconnect()
  }
}
export default handler
