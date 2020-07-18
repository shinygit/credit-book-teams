import getUserIdFromReq from '../../../utils/getUserIdFromReq'
import belongsToTeamAs from '../../../utils/authorization/belongsToTeamAs'
import prisma from '../../../prisma/prisma'

const handler = async (req, res) => {
  try {
    const userId = await getUserIdFromReq(req, res)
    if (!userId) return res.end()
    const foundCredit = await prisma.credit.findOne({
      where: { id: req.query.id },
    })
    const belongsToTeam = await belongsToTeamAs(userId, foundCredit.teamId)
    if (!belongsToTeamAs)
      res.json({ error: 'You do not belong to a team that owns this credit.' })

    if (req.method === 'PUT') {
      const alreadyClaimed = await prisma.credit.findOne({
        where: { id: req.query.id },
      })
      if (alreadyClaimed.claimedBy)
        return res.json({ error: 'This credit has already been claimed.' })
      const credit = await prisma.credit.update({
        where: { id: req.query.id },
        data: {
          claimedBy: { connect: { id: userId } },
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
