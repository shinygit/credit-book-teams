import prisma from '../../prisma/prisma'

interface belongsToTeam {
  role: string
}

const belongsToTeamAs = async (
  userId: number,
  teamId: string
): Promise<belongsToTeam> => {
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
