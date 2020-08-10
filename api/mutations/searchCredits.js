export default async function searchCredits(teamid, data) {
  return (
    await fetch(`/api/credits/${teamid}/search`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).json()
}
