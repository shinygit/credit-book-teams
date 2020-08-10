import ClaimCredit from './ClaimCredit'
import dayjs from 'dayjs'
import { formatPhoneNumber } from '../../../utils/formatPhoneNumber'
const CreditDetails = ({ credit }) => {
  return (
    <div className='flex justify-between p-2 mb-3 bg-white border-2 border-black rounded'>
      <div className='flex flex-col'>
        <div className='flex'>
          {dayjs(credit.createdAt).format('MM/DD/YY')}
          <span className='pl-2'>{credit.createdBy?.name}</span>
        </div>
        <div className='flex flex-col'>
          <span className='text-3xl'>{credit.name}</span>
          <span className='ml-auto -mt-2'>
            {formatPhoneNumber(credit.phone)}
          </span>
        </div>
        <div className='flex flex-col'>
          <span className='text-xl'>
            {credit.dollarValue}
            {credit.itemValue}
          </span>
          <span>{credit.reason}</span>
        </div>
      </div>
      <div className='flex flex-col'>
        <div className='ml-auto'>
          <ClaimCredit credit={credit} />
        </div>
        <span>
          {credit.claimedAt && dayjs(credit.claimedAt).format('MM/DD/YY')}
        </span>
        <span>{credit.claimedBy?.name}</span>
      </div>
    </div>
  )
}

export default CreditDetails
