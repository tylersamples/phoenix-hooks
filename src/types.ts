import React from 'react'
import Phoenix from 'phoenix'

export enum SocketStates {
  UNINSTANTIATED = -1,
  CONNECTING,
  OPEN,
  CLOSING,
  CLOSED,
}

export enum ChannelStates {
  CLOSED,
  ERRORED,
  JOINED,
  JOINING,
  LEAVING
}

type CreatePhoenixContext = {
  socket: Phoenix.Socket | undefined
}

export const PhoenixContext =
  React.createContext({
    socket: undefined
  } as CreatePhoenixContext)
