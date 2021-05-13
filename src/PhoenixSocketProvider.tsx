import React, {useState, useMemo, useCallback} from 'react'
import {Socket, SocketConnectOption} from 'phoenix'

export const PhoenixContext = React.createContext({
  socket: undefined,
  readyState: undefined
})

type ProviderProps = {
  url: string,
  children: React.ReactNode
  opts?: Partial<SocketConnectOption>
}

/**
 *
 * @param props
 * @constructor
 */
export const PhoenixSocketProvider = (props: ProviderProps) => {
  if (!props.url)
    throw new Error("No url provided")

  const [socket] = useState(new Socket(props.url, props.opts))

  const readyState = useCallback(() => socket.connectionState(), [socket])
  socket.connect()

  return (
    <PhoenixContext.Provider value={{socket, readyState}}>
      {props.children}
    </PhoenixContext.Provider>
  )
}
