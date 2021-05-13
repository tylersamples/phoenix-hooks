import { useState, useCallback } from 'react'
import { useSocket } from './index'

import { Channel } from 'phoenix'

type ChannelOptions = {
  onClose?: () => void;
  onError?: () => void;
  onLeave?: () => void;
  onJoin?: () => void;
  onTimeout?: () => void;
}

/**
 *
 * @param channelName
 * @param params
 */
export function useChannel(channelName: string, params?: Partial<ChannelOptions>) {
  const phoenixSocket = useSocket()
  const { socket } = phoenixSocket

  const { onJoin, onError, onTimeout, onLeave, onClose } = params

  const [channelState, setChannelState] = useState({})

  const [channel] =
    useState(() => {
      const channel: Channel =
        socket.channel(channelName, params, phoenixSocket.socket)

      channel.join()
        .receive("ok", () => {
          if (typeof onJoin === "function")
            onJoin()
        })
        .receive("error", () => {
          if (typeof onError === "function")
            onError()
        })
        .receive("timeout", () => {
          if (typeof onTimeout === "function")
            onTimeout()
        })

      channel.onClose(() => {
        if (typeof onTimeout === "function")
          onClose()
      })

      return channel
    })

  const handleEventCallback =
    useCallback((event, callback) =>
      channel.on(event, callback),
      [channel, channel.on]
    )

  const pushEventCallback =
    useCallback((event, payload, timeout) =>
      channel.push(event, payload, timeout ? timeout : channel.timeout),
      [channel, channel.push]
    )

  const leaveCallback =
    useCallback(timeout =>
      channel
        .leave(timeout ? channel : channel.timeout)
        .receive("ok", () => {
          if (typeof onLeave === "function")
            onLeave()
        }),
      [channel, channel.on]
    )

  return {
    ...phoenixSocket,
    channel,
    channelState,
    handleEvent: handleEventCallback,
    pushEvent: pushEventCallback,
    leave: leaveCallback,
  }
}
