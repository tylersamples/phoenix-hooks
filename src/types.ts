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

export type SocketHook = {
  socketState: SocketStates;
  socket: Phoenix.Socket | undefined;
  socketConnect: () => void;
  socketDisconnect: (callback?: any, code?: any, reason?: any) => void;
  socketHandleMessage: (callback: (arg0: object) => void) => string;
}

export type ChannelHook = {
  channelState: ChannelStates;
  channel: Phoenix.Channel;
  handleChannelEvent: (event: any, callback: (arg0: object) => void) => number;
  pushChannelEvent: (event: any, payload: any, timeout?: any) => Phoenix.Push;
  leaveChannel: (timeout?: any) => void;
}

export type PresenceHook = {
  presence: Phoenix.Presence;
  handlePresenceJoin: (callback: (arg0: object) => void) => void;
  handlePresenceLeave: (callback: (arg0: object) => void) => void;
  handlePresenceSync: (callback: (arg0: object) => void) => void;
}

export const PhoenixContext =
  React.createContext({
    socket: undefined
  } as SocketHook)
