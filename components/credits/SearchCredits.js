import { useState, useCallback } from 'react'
import debounce from 'lodash/debounce'

const SearchCredits = ({ searchCreditsQuery, setSearchCreditsQuery }) => {
  const [searchCreditsInput, setSearchCreditsInput] = useState('')

  const debouncedSearch = useCallback(
    debounce((term) => {
      setSearchCreditsQuery({ ...searchCreditsQuery, searchTerm: term })
    }, 300),
    [debounce, setSearchCreditsQuery, searchCreditsQuery]
  )

  const handleChange = (e) => {
    setSearchCreditsInput(e.target.value)
    debouncedSearch(e.target.value)
  }

  return (
    <div>
      <input
        className='w-full p-1 border-2 border-black rounded'
        aria-label='search'
        value={searchCreditsInput}
        onChange={(e) => handleChange(e)}
        placeholder='Name or Phone Number or mm/dd/yy-mm/dd/yy'
      />
    </div>
  )
}
export default SearchCredits
