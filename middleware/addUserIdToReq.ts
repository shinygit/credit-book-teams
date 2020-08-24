import { getSession } from 'next-auth/client'
import { NextApiRequest } from 'next'
interface NextApiRequestWithUser extends NextApiRequest {
  userId?: number
}
const addUserIdToReq = async (req: NextApiRequestWithUser) => {
  const { userId } = (await getSession({ req })) || {}
  // if (!userId) return res.status(401).json({ error: 'Not logged in.' })
  req.userId = userId
}
export { addUserIdToReq }
export type { NextApiRequestWithUser }
