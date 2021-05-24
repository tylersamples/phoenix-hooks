import { useContext, useState, useRef, useCallback, useEffect } from 'react'
import Phoenix, { SocketConnectOption } from 'phoenix'

import { SocketStates, PhoenixContext, SocketHook } from './types'

type SocketOpts = SocketConnectOption & {
  onOpen: () => void;
  onClose: () => void;
  onError: (arg0: any) => void;
}

/**
 * Instantiate and connect using Phoenix sockets or use PhoenixSocketProviders socket.
 *
 * @param urlOrSocket
 * @param opts
 */
export function useSocket(urlOrSocket?: string | Phoenix.Socket, opts?: Partial<SocketOpts>) : SocketHook {
  if (typeof urlOrSocket !== 'undefined') {
    return usePhoenixSocket(urlOrSocket, opts)
  } else {
    return useContext(PhoenixContext)
  }
}

export function usePhoenixSocket(urlOrSocket: string | Phoenix.Socket, opts?: Partial<SocketOpts>) {
  const {onOpen, onClose, onError} = opts || {}

  const [socketState, setSocketState] = useState(SocketStates.UNINSTANTIATED)

  const socketRef = useRef<Phoenix.Socket>(typeof urlOrSocket == 'string' ? new Phoenix.Socket(urlOrSocket, opts) : urlOrSocket)

  useEffect(() => {
    // In the event our socket was not a new one. Use the connection state from the socketRef.
    switch (socketRef.current.connectionState())
    {
      case 'open':
        setSocketState(SocketStates.OPEN)
        break
      case 'closed' :
        setSocketState(SocketStates.CLOSED)
        break
      case 'closing':
        setSocketState(SocketStates.CLOSING)
        break
      case 'connecting':
        setSocketState(SocketStates.CONNECTING)
        break
    }
  }, [])

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
  }, [socketRef])

  const socketConnectCallback =
    useCallback(() =>
      socketRef.current.connect(),
      [socketRef],
    )

  const socketDisconnectCallback =
    useCallback((callback?, code?, reason?) =>
      socketRef.current.disconnect(callback, code, reason),
      [socketRef],
    )

  const socketOnMessageCallback =
    useCallback(callback =>
      socketRef.current.onMessage(callback),
      [socketRef],
    )

  return {
    socketState,
    socket: socketRef.current,
    socketConnect: socketConnectCallback,
    socketDisconnect: socketDisconnectCallback,
    socketHandleMessage: socketOnMessageCallback
  }
}
