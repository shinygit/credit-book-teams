import { getSession } from 'next-auth/client'
const addUserIdToReq = async (req, res) => {
  const { userId } = (await getSession({ req })) || {}
  // if (!userId) return res.status(401).json({ error: 'Not logged in.' })
  req.userId = userId
}
export { addUserIdToReq }
