# Phoenix Hooks

Phoenix Sockets, Channels, and Presence with React hooks.

## Getting Started


Installation:
```bash
$ npm install phoenix-hooks
```

### Provider

```
import {PhoenixSocketProvider} from 'phoenix-hooks'

<PhoenixSocketProvider url={`//localhost:4000/socket`}>

</PhoenixSocketProvider>
```

### Phoenix Socket

```
import { useSocket } from 'phoenix-hooks'


const { socket } = useSocket()
```

### Phoenix Channels

```
import { useChannels } from 'phoenix-hooks'


const { handleEvent, pushEvent } =
  useChannels(`chat:${123}`, () => {

  })
```


### Phoenix Presence

```
import { useChannels, usePresence } from 'phoenix-hooks'

const { channel } = useChannels(`chat:${123}`)
const { list } = usePresence(channel)
```

## License

[MIT](./LICENSE)
