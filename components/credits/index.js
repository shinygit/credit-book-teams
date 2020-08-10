import { useState } from 'react'

import useSWR from 'swr'
import SearchCredits from './SearchCredits'
import { searchCredits } from '../../api/mutations'
import ListCredits from './ListCredits'
import ShowClaimedToggle from './ShowClaimedToggle'

const Credits = ({ teamid }) => {
  const [searchCreditsQuery, setSearchCreditsQuery] = useState({
    searchTerm: '',
    claimed: false,
  })

  const { data: creditsData, error: creditsError } = useSWR(
    [
      `/api/credits/${teamid}/search`,
      searchCreditsQuery.searchTerm,
      searchCreditsQuery.claimed,
    ],
    () => searchCredits(teamid, searchCreditsQuery)
  )

  return (
    <>
      <SearchCredits
        searchCreditsQuery={searchCreditsQuery}
        setSearchCreditsQuery={setSearchCreditsQuery}
      />
      <ShowClaimedToggle
        searchCreditsQuery={searchCreditsQuery}
        setSearchCreditsQuery={setSearchCreditsQuery}
      />
      <ListCredits credits={creditsData} />
    </>
  )
}
export default Credits
