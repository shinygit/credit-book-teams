import { addUserIdToReq } from '../../../../middleware/addUserIdToReq'
import { belongsToTeamAs } from '../../../../utils/authorization/belongsToTeamAs'
import prisma from '../../../../prisma/prisma'
import Fuse from 'fuse.js'
import dayjs from 'dayjs'
const handler = async (req, res) => {
  try {
    await addUserIdToReq(req)
    if (!req.userId) return res.status(401).json({ error: 'Not logged in' })
    const role = await belongsToTeamAs(req.userId, req.query.teamid)
    if (!role)
      return res.status(401).json({ error: 'You do not belong to this team.' })
    if (req.method === 'POST') {
      if (/[0-9]{2}[\/][0-9]{2}[\/][0-9]{2}/.test(req.body.searchTerm)) {
        const match = req.body.searchTerm.match(
          /([0-9]{2}[\/][0-9]{2}[\/][0-9]{2})/g
        )
        const searchDate = new Date(match[0])
        const searchDateEnd = dayjs(searchDate).add(1, 'day').toDate()
        const foundCredits = await prisma.credit.findMany({
          orderBy: {
            createdAt: 'desc',
          },
          where: {
            teamId: req.query.teamId,
            createdAt: {
              gte: new Date(match[0]),
              lt: match[1]
                ? dayjs(new Date(match[1])).add(1, 'day').toDate()
                : searchDateEnd,
            },
            ...(!req.body.claimed && { claimedAt: { equals: null } }),
          },
          include: {
            claimedBy: { select: { name: true } },
            createdBy: { select: { name: true } },
          },
        })

        return res.json(foundCredits)
      }
      if (req.body.searchTerm) {
        const foundCredits = await prisma.credit.findMany({
          orderBy: {
            createdAt: 'desc',
          },
          where: {
            teamId: req.query.teamId,
            ...(!req.body.claimed && { claimedAt: { equals: null } }),
          },
          include: {
            claimedBy: { select: { name: true } },
            createdBy: { select: { name: true } },
          },
        })
        if (req.body.searchTerm === '') return res.json(foundCredits)

        const fuse = new Fuse(foundCredits, {
          keys: ['name', 'phone'],
        })

        const results = fuse.search(req.body.searchTerm)
        const responseResults = results.reduce((acc, credit) => {
          if (credit.item) acc.push(credit.item)
          return acc
        }, [])
        return res.json(responseResults)
      }
      if (req.body) {
        const foundCredits = await prisma.credit.findMany({
          orderBy: {
            createdAt: 'desc',
          },
          where: {
            teamId: req.query.teamId,
            ...(!req.body.claimed && { claimedAt: { equals: null } }),
          },
          include: {
            claimedBy: { select: { name: true } },
            createdBy: { select: { name: true } },
          },
        })
        return res.json(foundCredits)
      }
    }
  } catch (e) {
    console.log(e)
  } finally {
    await prisma.$disconnect()
  }
}
export default handler
