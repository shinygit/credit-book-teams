export default async function setDefaultTeam(teamId) {
  return (
    await fetch(`/api/teams/${teamId}/default`, {
      method: 'PUT',
    })
  ).json()
}
