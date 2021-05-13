import { useContext } from 'react'
import { PhoenixContext } from './PhoenixSocketProvider'

/**
 *
 */
export function useSocket() {
  const {socket, readyState} = useContext(PhoenixContext)

  return {
    socket,
    readyState
  }
}
