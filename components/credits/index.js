import { useState, useRef, useEffect } from 'react'

import useSWR, { useSWRInfinite } from 'swr'
import SearchCredits from './SearchCredits'
import { searchCredits } from '../../api/mutations'
import ListCredits from './ListCredits'
import ShowClaimedToggle from './ShowClaimedToggle'

const Credits = ({ teamid }) => {
  const observer = useRef(
    new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first.isIntersecting) {
          setSize((size) => size + 1)
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    )
  )
  const [element, setElement] = useState(null)
  useEffect(() => {
    const currentElement = element
    const currentObserver = observer.current

    if (currentElement) {
      currentObserver.observe(currentElement)
    }

    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement)
      }
    }
  }, [element])

  const [searchCreditsQuery, setSearchCreditsQuery] = useState({
    searchTerm: '',
    claimed: false,
  })
  const [loadMoreVisibile, setLoadMoreVisibile] = useState(true)
  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.length) {
      setLoadMoreVisibile(false)
      return null
    }
    return [
      `/api/credits/${teamid}/search?page=${pageIndex}`,
      searchCreditsQuery.searchTerm,
      searchCreditsQuery.claimed,
    ]
  }
  const {
    data: creditsData,
    error: creditsError,
    isValidating,
    mutate,
    size,
    setSize,
  } = useSWRInfinite(getKey, (url) => searchCredits(url, searchCreditsQuery))

  /*   const { data: creditsData, error: creditsError } = useSWR(
    [
      `/api/credits/${teamid}/search`,
      searchCreditsQuery.searchTerm,
      searchCreditsQuery.claimed,
    ],
    () => searchCredits(teamid, searchCreditsQuery)
  ) */
  const flattenedCreditsData = creditsData?.flat()
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
      <ListCredits credits={flattenedCreditsData} />
      {!searchCreditsQuery.searchTerm && loadMoreVisibile && (
        <button
          ref={setElement}
          onClick={() => {
            setSize((size) => size + 1)
          }}
        ></button>
      )}
    </>
  )
}
export default Credits
