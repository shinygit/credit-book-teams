import useSWR from 'swr'
export default function useCredit(cid) {
  const { data, error } = useSWR(`api/credit/${cid}`)
  return {
    credit: data,
    isLoading: !error && !data,
    isError: error,
  }
}
