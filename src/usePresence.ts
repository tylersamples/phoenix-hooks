import { useCallback, useContext } from 'react'
import { PhoenixContext } from './PhoenixSocketProvider'

export function usePresence(channelName?: string, opts?: any) {
  const {socket} = useContext(PhoenixContext)

  useCallback(() => {}, [])

  return {
    list: () => {}
  }
}
