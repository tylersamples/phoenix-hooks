import { useState, useCallback, useRef, useEffect } from 'react'

import { Socket } from 'phoenix'

import { useSocket  } from './useSocket'
import { ChannelStates } from './types'

type ChannelOptions = {
  onClose?: () => void;
  onError?: (err: any) => void;
  onLeave?: () => void;
  onJoin?: (arg0: object) => void;
  onTimeout?: () => void;
  socket: Socket;
  params: object;
}

/**
 * Join a Phoenix Channel
 *
 * @param channelName
 * @param params
 */
export function useChannel(channelName: string, params: Partial<ChannelOptions> = {}) {
  let { socket, ...opts } = params

  if (socket === undefined) {
    const phoenixSocket = useSocket()

    socket = phoenixSocket.socket
  }

  if (socket === undefined)
    throw new Error('Socket is undefined. Is component within a provider or has a socket been passed?')

  const { onJoin, onError, onTimeout, onLeave, onClose } = opts



  const [channelState, setChannelState] = useState(ChannelStates.CLOSED)

  const onCloseCallback = useCallback(() => {
    if (typeof onClose === 'function')
      onClose()

    setChannelState(ChannelStates.CLOSED)
  }, [])

  const onErrorCallback = useCallback(err => {
    if (typeof onError === 'function')
      onError(err)

    setChannelState(ChannelStates.ERRORED)
  }, [])

  const channelRef = useRef(socket.channel(channelName, opts))

  useEffect(() => {
    setChannelState(ChannelStates.JOINING)

    channelRef.current.join()
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

    channelRef.current.onClose(onCloseCallback)
    channelRef.current.onError(onErrorCallback)
    }, [channelRef])

  const handleEventCallback =
    useCallback((event, callback) =>
      channelRef.current.on(event, callback),
      [],
    )

  const pushEventCallback =
    useCallback((event, payload, timeout?) => {
        // @ts-ignore
        const pushTimeout: number = timeout ? timeout : socket['timeout']

        return channelRef.current.push(event, payload, pushTimeout)
      },
      [],
    )

  const leaveCallback =
    useCallback((timeout?) => {
      setChannelState(ChannelStates.LEAVING)

        // @ts-ignore
        const leaveTimeout: number = timeout ? timeout : socket['timeout']

        channelRef.current
        .leave(leaveTimeout)
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
      [],
    )

  return {
    channelState,
    channel: channelRef.current,
    handleChannelEvent: handleEventCallback,
    pushChannelEvent: pushEventCallback,
    leaveChannel: leaveCallback,
  }
}
