import { useState, useCallback } from 'react'
import { Channel, Presence } from 'phoenix'

import { useChannel } from './index'

/**
 *
 * @param channelOrChannelName
 * @param opts
 */
export function usePresence(channelOrChannelName: Channel | string, opts?: any) {
  let channel = null

  if (typeof channelOrChannelName == 'string') {
    let {channel} = useChannel(channelOrChannelName)
  } else {
    channel = channelOrChannelName as Channel
  }

  const [presence] = useState(new Presence(channel))

  const listCallback = useCallback(cb => presence.list(cb), [channel, presence])
  const onJoinCallback = useCallback(cb => presence.onJoin(cb), [channel, presence])
  const onLeaveCallback = useCallback(cb => presence.onLeave(cb), [channel, presence])

  return {
    ...channel,
    listPresence: listCallback,
    handlePresenceJoin: onJoinCallback,
    handlePresenceLeave: onLeaveCallback
  }
}
