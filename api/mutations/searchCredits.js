export default async function searchCredits(url, data) {
  return (
    await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).json()
}
