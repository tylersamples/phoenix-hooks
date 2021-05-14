import { useState, useCallback } from 'react'
import { useSocket, ChannelStates } from './index'

import { Channel } from 'phoenix'

type ChannelOptions = {
  onClose?: () => void;
  onError?: (err: any) => void;
  onLeave?: () => void;
  onJoin?: (object) => void;
  onTimeout?: () => void;
}

/**
 *
 * @param channelName
 * @param params
 */
export function useChannel(channelName: string, params: Partial<ChannelOptions> = {}) {
  const phoenixSocket = useSocket()
  const { socket } = phoenixSocket

  const { onJoin, onError, onTimeout, onLeave, onClose } = params

  const [channelState, setChannelState] = useState(ChannelStates.CLOSED)

  const onCloseCallback = useCallback(() => {
    if (typeof onTimeout === 'function')
      onClose()

    setChannelState(ChannelStates.CLOSED)
  })

  const onErrorCallback = useCallback(err => {
    if (typeof onError === 'function')
      onError(err)

    setChannelState(ChannelStates.ERRORED)
  })

  const [channel] =
    useState(() => {
      const channel: Channel =
        socket.channel(channelName, params, phoenixSocket.socket)

      setChannelState(ChannelStates.JOINING)

      channel.join()
        .receive('ok', args => {
          if (typeof onJoin === 'function')
            onJoin(args)

          setChannelState(ChannelStates.JOINED)
        })
        .receive('timeout', () => {
          if (typeof onTimeout === 'function')
            onTimeout()

          setChannelState(ChannelStates.ERRORED)
        })

      channel.onClose(onCloseCallback)
      channel.onError(onErrorCallback)

      return channel
    })

  const joinCallback =
    useCallback(() => {
        setChannelState(ChannelStates.JOINING)

        channel.rejoin()
        const joinRef = channel.joinRef()

          joinRef
          .receive('ok', args => {
            setChannelState(ChannelStates.JOINED)
          })
      },
      [channel]
    )

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
    useCallback(timeout => {
      setChannelState(ChannelStates.LEAVING)

      return channel
        .leave(timeout ? channel : channel.timeout)
        .receive('ok', () => {
          if (typeof onLeave === 'function')
            onLeave()

          onCloseCallback()
        })
        .receive('timeout', () => {
          if (typeof onLeave === 'function')
            onLeave()

          onCloseCallback()
        })
      },
      [channel, channel.on]
    )

  return {
    ...phoenixSocket,
    channel,
    channelState,
    handleChannelEvent: handleEventCallback,
    pushChannelEvent: pushEventCallback,
    leaveChannel: leaveCallback,
    rejoinChannel: joinCallback
  }
}
