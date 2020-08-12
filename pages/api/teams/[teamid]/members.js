import { addUserIdToReq } from '../../../../middleware/addUserIdToReq'
import { belongsToTeamAs } from '../../../../utils/authorization/belongsToTeamAs'
import prisma from '../../../../prisma/prisma'
const handler = async (req, res) => {
  try {
    await addUserIdToReq(req)
    if (!req.userId) return res.status(401).json({ error: 'Not logged in' })
    const role = await belongsToTeamAs(req.userId, req.query.teamid)
    if (!role)
      return res.status(401).json({ error: 'You do not belong to this team.' })
    if (req.method === 'GET') {
      const queriedTeamMembers = await prisma.user.findMany({
        where: {
          teams: {
            some: {
              teamId: {
                equals: req.query.teamid,
              },
            },
          },
        },
        select: {
          id: true,
          name: true,
          teams: { where: { teamId: { equals: req.query.teamid } } },
        },
      })
      const teamMembers = queriedTeamMembers.map((teamMember) => {
        return {
          id: teamMember.id,
          name: teamMember.name,
          role: teamMember.teams[0].role,
        }
      })
      return res.json(teamMembers)
    }
  } catch (e) {
    console.log(e)
  } finally {
    await prisma.$disconnect()
  }
}
export default handler
