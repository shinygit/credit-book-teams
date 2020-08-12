import { addUserIdToReq } from '../../../../middleware/addUserIdToReq'
import { NextApiRequestWithUser } from '../../../../middleware/addUserIdToReq.d.ts'
import { NextApiResponse } from 'next'
import prisma from '../../../../prisma/prisma'
import { belongsToTeamAs } from '../../../../utils/authorization/belongsToTeamAs'

type ReturnedCredit = {
  claimedAt: Date | null
  claimedById: string | null
  createdAt: Date
  createdById: string
  updatedAt: Date
  updatedById: string | null
  dollarValue: number | null
  itemValue: string | null
  id: string
  name: string | null
  phone: string | null
  reason: string | null
  teamId: string
  claimedBy: {
    name: string | null
  }
  createdBy: {
    name: string
  }
  updatedBy: {
    name: string
  }
}

type Error = {
  error: string
}

const handler = async (
  req: NextApiRequestWithUser,
  res: NextApiResponse<ReturnedCredit | Error>
) => {
  try {
    await addUserIdToReq(req)
    if (!req.userId) return res.status(401).json({ error: 'Not logged in' })
    if (Array.isArray(req.query.id))
      return res.status(401).json({ error: 'ID should only be a string.' })

    const foundCredit = await prisma.credit.findOne({
      where: { id: req.query.id },
    })
    if (!foundCredit)
      return res.json({ error: 'This does not appear to be a credit.' })

    const belongsToTeam = await belongsToTeamAs(req.userId, foundCredit.teamId)
    if (!belongsToTeam)
      return res.json({
        error: 'You do not belong to a team that owns this credit.',
      })
    if (foundCredit.claimedAt !== null)
      return res.json({
        error: 'You can not update a credit that has already been claimed.',
      })

    if (req.method === 'PUT') {
      const updatedCredit = await prisma.credit.update({
        where: { id: foundCredit.id },
        data: {
          ...req.body,
          updatedBy: { connect: { id: req.userId } },
          updatedAt: new Date().toISOString(),
        },
        include: {
          claimedBy: { select: { name: true } },
          createdBy: { select: { name: true } },
          updatedBy: { select: { name: true } },
        },
      })
      return res.json(updatedCredit)
    }

    if (req.method === 'DELETE') {
      //delete credit
    }
  } catch (e) {
    console.log(e)
  } finally {
    await prisma.$disconnect()
  }
}
export default handler
