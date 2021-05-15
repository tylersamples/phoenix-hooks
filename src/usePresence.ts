import {useState, useCallback, useEffect, useMemo} from 'react'
import { Channel, Presence } from 'phoenix'

/**
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

  const listCallback =
    useCallback((cb, by = undefined) =>
        presence.list(cb, by),
      [channel, presence]
    )

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

  const syncDiffCallback =
    useCallback((presences, diff, onJoin?, onLeave?) =>
      Presence.syncDiff(presences, diff, onJoin, onLeave),
      [channel, presence]
    )

  const syncStateCallback =
    useCallback((presences, state, onJoin?, onLeave?) =>
        Presence.syncState(presences, state, onJoin, onLeave),
      [channel, presence]
    )

  return {
    presence: presence,
    listPresence: listCallback,
    handlePresenceJoin: onJoinCallback,
    handlePresenceLeave: onLeaveCallback,
    handlePresenceSync: onSyncCallback,
    syncDiff: syncDiffCallback,
    syncState: syncStateCallback
  }
}
