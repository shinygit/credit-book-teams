import CreditDetails from './CreditDetails'
import ClaimCredit from './ClaimCredit'
const CreditRecord = ({ credit }) => {
  console.log(credit)
  return (
    <div className='w-full flex'>
      <CreditDetails credit={credit} />
      <ClaimCredit credit={credit} />
    </div>
  )
}

export default CreditRecord
