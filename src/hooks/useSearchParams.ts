import React, { useCallback, useMemo } from "react"
import { useHistory, useLocation } from "react-router-dom"

const useSearchParams = () => {
  const history = useHistory()
  const { search, pathname } = useLocation()

  const searchParams: URLSearchParams = useMemo(
    () => new URLSearchParams(search),
    [search]
  )
  const setSearchParams = useCallback(
    (key: string, value: string) => {
      searchParams.set(key, value)
      history.replace({
        pathname,
        search: searchParams.toString(),
      })
    },
    [history, pathname, searchParams]
  )

  return [searchParams, setSearchParams] as const
}

export default useSearchParams
