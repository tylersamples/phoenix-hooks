export enum SocketStates {
  UNINSTANTIATED,
  CONNECTING ,
  OPEN,
  CLOSING ,
  CLOSED ,
}

export enum ChannelStates {
  CLOSED,
  ERRORED,
  JOINED,
  JOINING,
  LEAVING
}

export { PhoenixSocketProvider } from './PhoenixSocketProvider'

export { useSocket } from './useSocket'
export { useChannel } from './useChannel'
export { usePresence } from './usePresence'
