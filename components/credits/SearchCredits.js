import { useState, useCallback, useRef } from 'react'
import debounce from 'lodash/debounce'

const SearchCredits = ({ searchCreditsQuery, setSearchCreditsQuery }) => {
  const searchInput = useRef(null)
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
  const handleClear = () => {
    setSearchCreditsInput('')
    debouncedSearch('')
    searchInput.current.focus()
  }

  return (
    <div className='flex justify-between w-full p-1 bg-white border-2 border-black rounded focus-within:shadow-outline-grey'>
      <input
        className='flex-grow outline-none'
        aria-label='search'
        ref={searchInput}
        value={searchCreditsInput}
        onChange={(e) => handleChange(e)}
        placeholder='Name or Phone Number or mm/dd/yy-mm/dd/yy'
      />
      <button onClick={handleClear} className='btn btn-white'>
        Clear
      </button>
    </div>
  )
}
export default SearchCredits
