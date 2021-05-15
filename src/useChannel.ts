import {useState, useCallback, useRef, useEffect} from 'react'
import {useSocket, ChannelStates} from './index'

import { Socket } from 'phoenix'

type ChannelOptions = {
  onClose?: () => void;
  onError?: (err: any) => void;
  onLeave?: () => void;
  onJoin?: (object) => void;
  onTimeout?: () => void;
  socket: Socket
}

/**
 *
 * @param channelName
 * @param params
 */
export function useChannel(channelName: string, params: Partial<ChannelOptions> = {}) {
  const { socket } = params

  const phoenixSocket = socket || useSocket()

  if (phoenixSocket.socket === undefined)
    throw new Error('Socket is undefined. Is component within a provider or has a socket been passed?')

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

  const channelRef = useRef(phoenixSocket.socket.channel(channelName, params, phoenixSocket.socket))

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
    useCallback((event, payload, timeout) =>
      channelRef.current.push(event, payload, timeout ? timeout : channelRef.current.timeout),
      [],
    )

  const leaveCallback =
    useCallback(timeout => {
      setChannelState(ChannelStates.LEAVING)

      channelRef.current
        .leave(timeout ? channelRef.current : channelRef.current.timeout)
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
    ...phoenixSocket,
    channel: channelRef.current,
    channelState,
    handleChannelEvent: handleEventCallback,
    pushChannelEvent: pushEventCallback,
    leaveChannel: leaveCallback,
  }
}
