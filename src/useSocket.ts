import { useContext } from 'react'
import { PhoenixContext } from './PhoenixSocketProvider'

type SocketOptions = {
  onClose?: (event: any) => void;
  onError?: (event: any) => void;
  onLeave?: (event: any) => void;
}

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
