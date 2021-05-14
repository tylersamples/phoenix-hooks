import { useContext, useState, useCallback } from 'react'
import { PhoenixContext } from './PhoenixSocketProvider'
import { Socket, SocketConnectOption } from 'phoenix'
import { SocketStates } from './index'

type SocketOpts = SocketConnectOption & {
  onOpen: () => void;
  onClose: () => void;
  onError: (any) => void;
}

/**
 *
 */
export function useSocket(url?: string, opts?: Partial<SocketOpts>) {
  if (typeof url !== 'undefined') {
    return usePhoenixSocket(url, opts)
  } else {
    return useContext(PhoenixContext)
  }
}

export function usePhoenixSocket(url?: string, opts?: Partial<SocketOpts>) {
  const {onOpen, onClose, onError} = opts || {}

  const [socketState, setSocketState] = useState(SocketStates.UNINSTANTIATED)

  const onOpenCallback =
    useCallback(() => {
      if (typeof onOpen === 'function')
        onOpen()
    }, [onOpen])

  const onCloseCallback =
    useCallback(() => {
      if (typeof onClose === 'function')
        onClose()
    }, [onClose])

  const onErrorCallback =
    useCallback(err => {
      if (typeof onError === 'function')
        onError(err)
    }, [onError])

  let [socket] = useState(() => {
    const socket = new Socket(url, opts)

    socket.onOpen(() => {
      onOpenCallback()

      setSocketState(SocketStates.OPEN)
    })

    socket.onClose(() => {
      onCloseCallback()

      setSocketState(SocketStates.CLOSED)
    })

    socket.onError(err => {
      onErrorCallback(err)

      setSocketState(SocketStates.CLOSING)
    })
    setSocketState(SocketStates.CONNECTING)

    socket.connect()
    return socket
  })

  return {
    socket,
    socketState
  }
}
