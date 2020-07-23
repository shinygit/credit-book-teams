import { addUserIdToReq } from '../../../../middleware/addUserIdToReq'
import prisma from '../../../../prisma/prisma'
import { belongsToTeamAs } from '../../../../utils/authorization/belongsToTeamAs'

const handler = async (req, res) => {
  try {
    await addUserIdToReq(req)
    if (!req.userId) return res.status(401).json({ error: 'Not logged in' })
    if (req.method === 'POST') {
      const belongsToTeam = await belongsToTeamAs(req.userId, req.query.teamid)
      if (!belongsToTeam)
        return res.json({ error: 'You do not belong to this team.' })
      const credit = await prisma.credit.create({
        data: {
          ...req.body,
          team: { connect: { id: req.query.teamid } },
          createdBy: { connect: { id: req.userId } },
        },
      })
      return res.json(credit)
    }
  } catch (e) {
    console.log(e)
  } finally {
    await prisma.disconnect()
  }
}
export default handler
