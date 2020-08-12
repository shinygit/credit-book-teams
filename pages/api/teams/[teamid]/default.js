import { addUserIdToReq } from '../../../../middleware/addUserIdToReq'
import prisma from '../../../../prisma/prisma'
import { belongsToTeamAs } from '../../../../utils/authorization/belongsToTeamAs'

const handler = async (req, res) => {
  try {
    await addUserIdToReq(req)
    if (!req.userId) return res.status(401).json({ error: 'Not logged in' })
    const role = await belongsToTeamAs(req.userId, req.query.teamid)
    if (!role)
      return res.status(401).json({ error: 'You do not belong to this team.' })
    if (req.method === 'PUT') {
      const newDefaultTeam = await prisma.user.update({
        where: { id: req.userId },
        data: { defaultTeam: { connect: { id: req.query.teamid } } },
        include: { defaultTeam: { select: { id: true, teamName: true } } },
      })
      res.json(newDefaultTeam.defaultTeam)
    }
  } catch (e) {
    console.log(e)
  } finally {
    await prisma.$disconnect()
  }
}
export default handler
