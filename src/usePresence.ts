import { useCallback, useContext } from 'react'
import { PhoenixContext } from './PhoenixSocketProvider'

/**
 *
 * @param channelName
 * @param opts
 */
export function usePresence(channelName?: string, opts?: any) {
  const {socket} = useContext(PhoenixContext)

  useCallback(() => {}, [])

  return {
    list: () => {}
  }
}
