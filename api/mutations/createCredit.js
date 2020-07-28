export default async function createCredit(teamid, data) {
  return (
    await fetch(`/api/credits/${teamid}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).json()
}
