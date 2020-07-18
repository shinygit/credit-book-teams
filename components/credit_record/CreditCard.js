import CustomerDetails from './CustomerDetails'
import ClaimCredit from './ClaimCredit'
import useCredit from '../../hooks/useCredit'
const CreditCard = ({ cid }) => {
  const { credit, isLoading, isError } = useCredit(cid)
  if (isError) return <div>Error...</div>
  if (!credit) return <div>Loading...</div>
  return (
    <div className='w-full flex'>
      <CustomerDetails />
      <ClaimCredit />
    </div>
  )
}

export default CreditCard
