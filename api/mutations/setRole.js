export default async function searchCredits(teamid, data) {
  return (
    await fetch(`/api/teams/${teamid}/role`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).json()
}
