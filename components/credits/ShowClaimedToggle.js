import { Switch } from '@chakra-ui/core'

const ShowClaimedToggle = ({ searchCreditsQuery, setSearchCreditsQuery }) => {
  const handleClick = () => {
    setSearchCreditsQuery({
      ...searchCreditsQuery,
      claimed: !searchCreditsQuery.claimed,
    })
  }

  return (
    <div className='flex items-center m-2'>
      <span className='mr-2'>Show Claimed?</span>
      <div
        className={`relative w-12 h-8 border border-black transition duration-200 ease-linear rounded ${
          searchCreditsQuery.claimed ? 'bg-gray-500' : 'bg-gray-300'
        }`}
      >
        <label
          htmlFor='toggle'
          className={`absolute left-0 bg-white border border-black w-1/2 h-full transition transform duration-200 ease-linear rounded ${
            searchCreditsQuery.claimed ? 'translate-x-full' : 'translate-x-0'
          }`}
        />
        <input
          onClick={handleClick}
          type='checkbox'
          id='toggle'
          className='w-full h-full appearance-none active:outline-none focus:outline-none'
        />
      </div>
    </div>
  )
}
export default ShowClaimedToggle
