export default async function joinTeam(data) {
  return (
    await fetch('/api/teams/joincode', {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).json()
}
