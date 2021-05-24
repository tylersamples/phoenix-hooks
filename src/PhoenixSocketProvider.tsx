import React from 'react'
import Phoenix, { SocketConnectOption } from 'phoenix'

import { PhoenixContext } from './types'
import { useSocket } from './useSocket'

type ProviderProps = {
  children: React.ReactNode
  opts?: Partial<SocketConnectOption>
} & ({ url: string} | { socket: Phoenix.Socket})

/**
 * Phoenix Socket context provider.
 *
 * @param props
 * @constructor
 */
export const PhoenixSocketProvider : React.FC<ProviderProps> = (props: ProviderProps) => {
  const urlOrSocket = 'url' in props ? props.url : props.socket

  if (!urlOrSocket)
    throw new Error('No url or socket provided')

  const phoenixSocket = useSocket(urlOrSocket, props.opts)

  return (
    <PhoenixContext.Provider value={{...phoenixSocket}}>
      {props.children}
    </PhoenixContext.Provider>
  )
}
