export default async function createJoinCode(teamId) {
  return (
    await fetch(`/api/teams/${teamId}/joincode`, {
      method: 'POST',
    })
  ).json()
}
