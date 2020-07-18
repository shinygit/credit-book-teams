import prisma from '../../prisma/prisma'
const belongsToTeamAs = async (userId, teamId) => {
  return await prisma.userTeam.findOne({
    where: {
      teamId_userId: {
        userId,
        teamId,
      },
    },
    select: { roll: true },
  })
}
export default belongsToTeamAs
