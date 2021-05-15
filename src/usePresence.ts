import { useState, useCallback, useEffect, useMemo } from 'react'
import { Channel, Presence } from 'phoenix'

/**
 * Use Phoenix Presence for a given channel.
 *
 * @param channel
 * @param opts
 */
export function usePresence(channel: Channel, opts?: any) {
  const [sync, setSync] = useState([])

  const presence = useMemo(() => new Presence(channel), [channel]);

  useEffect(() => {
    presence.onSync(() => {
      setSync(presence.list())
    })
  }, [presence])

  const onJoinCallback =
    useCallback(cb =>
        presence.onJoin(cb),
      [channel, presence]
    )

  const onLeaveCallback =
    useCallback(cb =>
        presence.onLeave(cb),
      [channel, presence]
    )

  const onSyncCallback = useCallback(cb => cb(sync), [channel, presence, sync])

  return {
    presence: presence,
    handlePresenceJoin: onJoinCallback,
    handlePresenceLeave: onLeaveCallback,
    handlePresenceSync: onSyncCallback
  }
}
