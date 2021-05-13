import { useState, useCallback } from 'react'

import { Channel, Presence } from 'phoenix'

/**
 *
 * @param channel
 * @param opts
 */
export function usePresence(channel: Channel, opts?: any) {
  const [presence] = useState(new Presence(channel))

  const listCallback = useCallback(cb => presence.list(cb), [channel, presence])
  const onJoinCallback = useCallback(cb => presence.onJoin(cb), [channel, presence])
  const onLeaveCallback = useCallback(cb => presence.onLeave(cb), [channel, presence])

  return {
    ...channel,
    list: listCallback,
    handleJoin: onJoinCallback,
    handleLeave: onLeaveCallback
  }
}
