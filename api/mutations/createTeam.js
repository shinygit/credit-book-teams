export default async function createTeam(data) {
  return (
    await fetch('/api/teams', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).json()
}
