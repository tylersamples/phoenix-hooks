import React from 'react'
import { SocketConnectOption } from 'phoenix'

import { useSocket } from './useSocket'

export const PhoenixContext = React.createContext({
  socket: undefined,
  socketStatus: null
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
    throw new Error('No url provided')

  const phoenixSocket = useSocket(props.url, props.opts)

  return (
    <PhoenixContext.Provider value={{...phoenixSocket}}>
      {props.children}
    </PhoenixContext.Provider>
  )
}
