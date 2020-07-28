import CreditRecord from './credit_record'
const ListCredits = ({ credits = [] }) => {
  return credits.map((credit) => (
    <CreditRecord credit={credit} key={credit.id} />
  ))
}
export default ListCredits
