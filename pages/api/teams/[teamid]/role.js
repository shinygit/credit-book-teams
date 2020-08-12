import { addUserIdToReq } from '../../../../middleware/addUserIdToReq'
import { belongsToTeamAs } from '../../../../utils/authorization/belongsToTeamAs'
import prisma from '../../../../prisma/prisma'
const handler = async (req, res) => {
  try {
    await addUserIdToReq(req)
    if (!req.userId) return res.status(401).json({ error: 'Not logged in' })
    const { role } = await belongsToTeamAs(req.userId, req.query.teamid)
    if (role !== 'OWNER')
      return res.status(403).json({ error: 'You do not own this team.' })
    if (req.method === 'PUT') {
      if (!['USER', 'SHARED'].includes(req.body.role))
        return res.status(422).json({ error: 'This is not a valid role' })
      const currentRole = await prisma.userTeam.findMany({
        where: { userId: req.body.userId, teamId: req.query.teamid },
      })
      if (currentRole[0].role === 'OWNER')
        return res.status(422).json({ error: 'Can not alter owners role.' })
      await prisma.userTeam.updateMany({
        where: { userId: req.body.userId, teamId: req.query.teamid },
        data: { role: req.body.role },
      })
      const updatedUser = await prisma.user.findOne({
        where: { id: req.body.userId },
        select: {
          id: true,
          name: true,
          teams: { where: { teamId: { equals: req.query.teamid } } },
        },
      })
      return res.json(updatedUser)
    }
  } catch (e) {
    console.log(e)
  } finally {
    await prisma.$disconnect()
  }
}
export default handler
