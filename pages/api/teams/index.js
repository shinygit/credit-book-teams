import { addUserIdToReq } from '../../../middleware/addUserIdToReq'
import prisma from '../../../prisma/prisma'
const handler = async (req, res) => {
  try {
    await addUserIdToReq(req)
    if (!req.userId) return res.status(401).json({ error: 'Not logged in' })
    if (req.method === 'POST') {
      const teamNameAlreadyExistsForUser = await prisma.team.findMany({
        where: {
          teamName: req.body.teamName,
          users: { some: { userId: req.userId } },
        },
      })
      if (teamNameAlreadyExistsForUser.length > 0) {
        return res.status(409).json({ error: 'Team name already exists.' })
      }

      const userTeam = await prisma.userTeam.create({
        data: {
          role: 'ADMIN',
          team: { create: { teamName: req.body.teamName } },
          user: { connect: { id: req.userId } },
        },
        select: {
          team: true,
        },
      })
      return res.json(userTeam.team)
    }

    if (req.method === 'GET') {
      const teams = await prisma.team.findMany({
        where: {
          users: { some: { userId: req.userId } },
        },
      })
      return res.json(teams)
    }
  } catch (e) {
    console.log(e)
  } finally {
    await prisma.disconnect()
  }
}
export default handler
