export default async function claimCredit(teamId, creditId, data) {
  return (
    await fetch(`/api/credits/${teamId}/claimed/${creditId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).json()
}
