import React, { useState, useMemo } from 'react'
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

export const PhoenixSocketProvider = (props: ProviderProps) => {
  if (!props.url)
    throw new Error("No url provided")

  const [socket] = useState(new Socket(props.url, props.opts))
  // @ts-ignore
  const readyState = useMemo(() => socket.connectionState(), [socket.conn, socket.conn.readyState])
  socket.connect()

  console.log(socket.connectionState())

  return (
    <PhoenixContext.Provider value={{socket, readyState}}>
      {props.children}
    </PhoenixContext.Provider>
  )
}
