import crypto from 'crypto'
import { addUserIdToReq } from '../../../../../middleware/addUserIdToReq'
import prisma from '../../../../../prisma/prisma'
const handler = async (req, res) => {
  try {
    await addUserIdToReq(req)
    if (!req.userId) return res.status(401).json({ error: 'Not logged in' })
    if (req.method === 'POST') {
      const team = await prisma.userTeam.findOne({
        where: {
          teamId_userId: {
            teamId: req.query.teamid,
            userId: req.userId,
          },
        },
        include: { team: true },
      })
      if (!team.role === 'ADMIN') {
        return res.status(403).json({ error: 'You do not own this team' })
      }

      let expirationTime = new Date()
      expirationTime.setMinutes(expirationTime.getMinutes() + 5)

      let joinCode = crypto.randomBytes(4).toString('hex')

      const teamWithCode = await prisma.team.update({
        where: {
          id: req.query.teamid,
        },
        data: {
          joinCode: joinCode,
          joinCodeExpiration: expirationTime.toISOString(),
          joinAttempts: 0,
        },
      })
      return res.status(200).json(teamWithCode)
    }
    if (req.method === 'DELETE') {
      const team = await prisma.userTeam.findOne({
        where: {
          teamId_userId: {
            teamId: req.query.teamid,
            userId: req.userId,
          },
        },
        include: { team: true },
      })
      if (!team.role === 'ADMIN') {
        return res.status(403).json({ error: 'You do not own this team' })
      }

      const teamWithClearedJoinCode = await prisma.team.update({
        where: {
          id: req.query.teamid,
        },
        data: {
          joinCode: null,
          joinCodeExpiration: null,
          joinAttempts: null,
        },
      })

      return res.status(200).json(teamWithClearedJoinCode)
    }
  } catch (e) {
    console.log(e)
  } finally {
    await prisma.disconnect()
  }
}
export default handler
