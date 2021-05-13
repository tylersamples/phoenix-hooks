import { useState, useCallback } from 'react'
import { useSocket } from './index'

type ChannelOptions = {
  onClose?: (event: any) => void;
  onError?: (event: any) => void;
  onLeave?: (event: any) => void;
  onJoin?: (event: any) => void;
}

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

  return {
    ...phoenixSocket,
    handleEvent: handleEventCallback,
    pushEvent: pushEventCallback
  }
}
