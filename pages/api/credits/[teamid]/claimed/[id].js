import { addUserIdToReq } from '../../../../../middleware/addUserIdToReq'
import { belongsToTeamAs } from '../../../../../utils/authorization/belongsToTeamAs'
import prisma from '../../../../../prisma/prisma'
const handler = async (req, res) => {
  try {
    await addUserIdToReq(req)
    if (!req.userId) return res.status(401).json({ error: 'Not logged in' })

    const foundCredit = await prisma.credit.findOne({
      where: { id: req.query.id },
    })

    const belongsToTeam = await belongsToTeamAs(req.userId, foundCredit.teamId)
    if (!belongsToTeamAs)
      return res.json({
        error: 'You do not belong to a team that owns this credit.',
      })
    if (req.method === 'PUT') {
      if (foundCredit.claimedById)
        return res.json({ error: 'This credit has already been claimed.' })

      const credit = await prisma.credit.update({
        where: { id: req.query.id },
        data: {
          claimedBy: { connect: { id: req.userId } },
          claimedAt: new Date().toISOString(),
        },
      })
      return res.json(credit)
    }
    if (req.method === 'DELETE') {
      // unclaim a credit
    }
  } catch (e) {
    console.log(e)
  } finally {
    await prisma.disconnect()
  }
}
export default handler
