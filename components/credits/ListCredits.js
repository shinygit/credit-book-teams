import CreditDetails from './credit_record/CreditDetails'
const ListCredits = ({ credits = [] }) => {
  return credits.map((credit) => (
    <CreditDetails credit={credit} key={credit.id} />
  ))
}
export default ListCredits
