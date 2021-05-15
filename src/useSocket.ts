import {useContext, useState, useRef, useCallback, useEffect, useImperativeHandle} from 'react'
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

  const socketRef = useRef(new Socket(url, opts))

  useEffect(() => {
    socketRef.current.onOpen(() => {
      onOpenCallback()

      setSocketState(SocketStates.OPEN)
    })

    socketRef.current.onClose(() => {
      onCloseCallback()

      setSocketState(SocketStates.CLOSED)
    })

    socketRef.current.onError(err => {
      onErrorCallback(err)

      setSocketState(SocketStates.CLOSING)
    })
    setSocketState(SocketStates.CONNECTING)

    socketRef.current.connect()
  })

  return {
    socket: socketRef.current,
    socketState
  }
}
