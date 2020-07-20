import getUserIdFromReq from '../../../utils/getUserIdFromReq'
import belongsToTeamAs from '../../../utils/authorization/belongsToTeamAs'
import prisma from '../../../prisma/prisma'

const handler = async (req, res) => {
  try {
    const userId = await getUserIdFromReq(req, res)
    if (!userId) return res.end()
    if (req.method === 'POST') {
      console.log('hmm index2')
      const belongsToTeam = await belongsToTeamAs(userId, req.query.teamid)
      if (!belongsToTeamAs)
        res.json({ error: 'You do not belong to this team.' })
      const credit = await prisma.credit.create({
        data: {
          ...req.body,
          team: { connect: { id: teamId } },
          createdBy: { connect: { id: userId } },
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
