import { addUserIdToReq } from '../../../middleware/addUserIdToReq'
import prisma from '../../../prisma/prisma'

import { NextApiRequestWithUser } from '../../../middleware/nextApiRequestWithUser'
import { NextApiResponse } from 'next'

const handler = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
  try {
    await addUserIdToReq(req)
    if (!req.userId) return res.status(401).json({ error: 'Not logged in' })
    if (req.method === 'POST') {
      if (!req.body.teamName) {
        return res.status(400).json({ error: 'Why is the name empty?' })
      }
      if (req.body.teamName.length < 10) {
        return res
          .status(400)
          .json({ error: 'Team name must be at least 10 characters long' })
      }
      const existingTeamsForUser = await prisma.team.findMany({
        where: {
          users: { some: { userId: req.userId } },
        },
      })

      const teamNameAlreadyExistsForUser = existingTeamsForUser.find((team) => {
        if (
          team.teamName
            .trim()
            .localeCompare(req.body.teamName.trim(), undefined, {
              sensitivity: 'base',
              ignorePunctuation: true,
            }) === 0
        )
          return true
      })

      if (teamNameAlreadyExistsForUser) {
        return res.status(409).json({ error: 'Team name already exists.' })
      }

      const userTeam = await prisma.userTeam.create({
        data: {
          role: 'OWNER',
          team: { create: { teamName: req.body.teamName.trim() } },
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
      const user = await prisma.user.findOne({
        where: { id: req.userId },
      })
      if (!user) return res.status(401).json({ error: 'Not logged in' })
      const teamsWithDefault = teams.map((team) => {
        if (team.id === user.defaultTeamId) {
          return { ...team, isDefaultTeam: true }
        }
        return { ...team, isDefaultTeam: false }
      })
      return res.json(teamsWithDefault)
    }
  } catch (e) {
    console.log(e)
  } finally {
    await prisma.$disconnect()
  }
}
export default handler
