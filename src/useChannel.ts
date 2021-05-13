import { useState, useCallback } from 'react'
import { useSocket } from './index'

type ChannelOptions = {
  onClose?: (event: any) => void;
  onError?: (event: any) => void;
  onLeave?: (event: any) => void;
  onJoin?: (event: any) => void;
}



/**
 *
 * @param channelName
 * @param params_or_callback
 * @param callback
 */
export function useChannel(channelName: string, params_or_callback?: any, callback?: any) {
  const phoenixSocket = useSocket()

  let joinCallback = callback
  let params = {}

  if (typeof params_or_callback === "function") {
    joinCallback = params_or_callback
  } else {
    params = params_or_callback
  }

  const [channel] =
    useState(() => {
      const channel: any =
        phoenixSocket.socket.channel(channelName, params, phoenixSocket.socket)

      channel.join()
        .receive("ok", () => {
          joinCallback()
        })

      return channel
    })

  // OnError
  // OnClose

  const handleEventCallback = useCallback((event, callback) =>
    channel.on(event, callback),[channel, channel.on])

  const pushEventCallback =
    useCallback((event, payload, timeout) =>
      channel.push(event, payload, timeout ? timeout : channel.timeout), [channel, channel.push])

  const leaveCallback = useCallback(timeout => {
    return channel
      .leave(timeout ? channel : channel.timeout)
      .receive("ok", () => null)
  }, [channel, channel.on])

  return {
    ...phoenixSocket,
    channel,
    handleEvent: handleEventCallback,
    pushEvent: pushEventCallback,
    leave: leaveCallback
  }
}
