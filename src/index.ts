export enum ReadyState {
  UNINSTANTIATED = -1,
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
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
