import React from 'react'
import { SocketConnectOption } from 'phoenix'

import { PhoenixContext } from './types'
import { useSocket } from './useSocket'

type ProviderProps = {
  url: string,
  children: React.ReactNode
  opts?: Partial<SocketConnectOption>
}

/**
 * Phoenix Socket context provider.
 *
 * @param props
 * @constructor
 */
export const PhoenixSocketProvider : React.FC<ProviderProps> = (props: ProviderProps) => {
  if (!props.url)
    throw new Error('No url provided')

  const phoenixSocket = useSocket(props.url, props.opts)

  return (
    <PhoenixContext.Provider value={{...phoenixSocket}}>
      {props.children}
    </PhoenixContext.Provider>
  )
}
