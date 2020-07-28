const CreditDetails = ({ credit }) => {
  return (
    <div>
      Customer Name: {credit.name}
      Phone Number: {credit.phone}
      claimed At: {credit.claimedAt}
    </div>
  )
}

export default CreditDetails
