export default async function claimCredit(teamId, creditId) {
  return (
    await fetch(`/api/credits/${teamId}/claimed/${creditId}`, {
      method: 'PUT',
    })
  ).json()
}
