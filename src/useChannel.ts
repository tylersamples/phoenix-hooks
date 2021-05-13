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
 * @param props
 */
export function useChannel(channelName: string, props?: Partial<ChannelOptions>) {
  const phoenixSocket = useSocket()

  const [channel] = useState(() => {
    const channel: any =
      phoenixSocket.socket.channel(channelName, props)

    channel.join()

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
