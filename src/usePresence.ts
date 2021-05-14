import {useState, useCallback, useEffect} from 'react'
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

  const [sync, setSync] = useState([])

  const [presence] = useState(new Presence(channel))

  useEffect(() => {
    presence.onSync(() => {
      setSync(Presence.list(presence))
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
    ...channel,
    listPresence: listCallback,
    handlePresenceJoin: onJoinCallback,
    handlePresenceLeave: onLeaveCallback,
    handlePresenceSync: onSyncCallback,
    syncDiff: syncDiffCallback,
    syncState: syncStateCallback
  }
}
