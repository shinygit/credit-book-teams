import prisma from '../../prisma/prisma'
const belongsToTeamAs = async (userId, teamId) => {
  return (
    (await prisma.userTeam.findOne({
      where: {
        teamId_userId: {
          userId,
          teamId,
        },
      },
      select: { role: true },
    })) || undefined
  )
}
export { belongsToTeamAs }
