import { addUserIdToReq } from '../../../middleware/addUserIdToReq'
import prisma from '../../../prisma/prisma'
const handler = async (req, res) => {
  try {
    await addUserIdToReq(req)
    if (!req.userId) return res.status(401).json({ error: 'Not logged in' })
    if (req.method === 'PUT') {
      const teamMatch = await prisma.team.findMany({
        where: {
          teamName: req.body.teamName,
          joinCode: { not: null },
        },
      })
      if (!teamMatch[0]) return res.status(403).json({ error: 'No Match!' })

      const expiration = new Date(teamMatch[0].joinCodeExpiration)
      const now = new Date()
      if (expiration < now)
        return res.status(403).json({ error: 'Code is expired!' })
      if (teamMatch[0].joinAttempts > 5)
        return res.status(403).json({ error: 'Too Many Attempts' })
      if (teamMatch) {
        await prisma.team.updateMany({
          data: { joinAttempts: teamMatch[0].joinAttempts + 1 },
          where: { teamName: req.body.teamName },
        })
      }

      const teamMatchingCode = await prisma.team.findMany({
        where: { teamName: req.body.teamName, joinCode: req.body.joinCode },
      })
      if (teamMatchingCode.length < 1)
        return res.status(403).json({ error: 'No Match!' })

      const isAlreadyMember = await prisma.userTeam.findOne({
        where: {
          teamId_userId: {
            userId: req.userId,
            teamId: teamMatchingCode[0].id,
          },
        },
      })
      if (isAlreadyMember)
        return res.status(409).json({ error: 'You are already a member.' })

      const newJoin = await prisma.userTeam.create({
        data: {
          role: 'USER',
          team: { connect: { id: teamMatchingCode[0].id } },
          user: { connect: { id: req.userId } },
        },
        select: {
          team: true,
        },
      })

      const teamWithClearedJoinCode = await prisma.team.update({
        where: {
          id: teamMatchingCode[0].id,
        },
        data: {
          joinCode: null,
          joinCodeExpiration: null,
          joinAttempts: null,
        },
      })

      res.json(newJoin.team)
    }
  } catch (e) {
    console.log(e)
  } finally {
    await prisma.disconnect()
  }
}
export default handler
