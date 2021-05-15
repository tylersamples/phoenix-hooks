# Phoenix Hooks

Phoenix Sockets, Channels, and Presence with React hooks.

## Getting Started

Installation:
```bash
$ npm install phoenix-hooks
```

### Phoenix Socket

```typescript
import { useSocket } from 'phoenix-hooks'

const { socket, socketState } = useSocket(`//localhost:4000/socket`, {params: {userToken: "<token value>"}})
```

#### `useSocket`

#### Arguments
* `url`: `string`
  * `wss://localhost:4000/socket`
  * `ws://localhost:4000/socket`
  * `localhost:4000/socket`
  * `/socket`
* `opts`: `SocketOptions`

```typescript
type SocketOptions = {
  binaryType: BinaryType;
  params: object | (() => object);
  transport: string;
  timeout: number;
  heartbeatIntervalMs: number;
  longpollerTimeout: number;
  encode: (payload: object, callback: (encoded: any) => void) => void;
  decode: (payload: string, callback: (decoded: any) => void) => void;
  logger: (kind: string, message: string, data: any) => void;
  reconnectAfterMs: (tries: number) => number;
  rejoinAfterMs: (tries: number) => number;
  vsn: string;
  onOpen: () => void;
  onClose: () => void;
  onError: (any) => void;
}
```

#### `socketState`
```typescript
enum SocketStates {
  UNINSTANTIATED = -1,
  CONNECTING,
  OPEN,
  CLOSING,
  CLOSED,
}
```
Enum representing the socket state. 

#### `socket`
The underlying Phoenix Socket class. 

#### `socketDisconnect`
Disconnect to the socket.

##### Example
```typescript jsx
<button onClick={() => socketDisconnect()}>Disconnect</button>
```

#### `socketConnect`
Connect to the socket. `useSocket` will start the socket for you so this may not be needed; use for explicitly reconnecting after using `socketDisconnect`.

##### Example
```typescript jsx
<button onClick={() => socketConnect()}>Connect</button>
```

#### `socketHandleMessage`
Handle callback on each message received 

##### Example
```typescript jsx
useEffect(() => {
  socketHandleMessage(message => {
    console.log('socketHandleMessage', message)
  })
}, [socketHandleMessage])
```

### Phoenix Channels

```typescript
import { useChannels } from 'phoenix-hooks'

const { socket } = useSocket(`//localhost:4000/socket`) // Optional, see Provider
const { handleChannelEvent, pushChannelEvent } = 
  useChannels(`chat:${123}`, {onJoin: params => {
    // Use params set join/3 response
  }})
```

#### `useChannels`
Connect to a given Phoenix channel.

#### Arguments
* `channelName`: `string`
* `opts`: `ChannelOptions`

```typescript
type ChannelOptions = {
  onClose?: () => void; 
  onError?: (err: any) => void;
  onLeave?: () => void;
  onJoin?: (object) => void; // Useful for getting join/3 response 
  onTimeout?: () => void;
  socket: Socket;
  params: object;
}
```


#### `channelState`
```typescript
enum ChannelStates {
  CLOSED,
  ERRORED,
  JOINED,
  JOINING,
  LEAVING
}
```
Enum representing the connection status to a channel. `JOINED` is the "everything is fine here" state.

#### `channel`
The underlying Phoenix Channel class.

#### `handleChannelEvent`

Handle callback for a specific channel event

##### Example
```typescript jsx
useEffect(() => {
  handleChannelEvent("selection", response => {
    console.log('handleChannelEvent', response)
  })
}, [socketHandleMessage])
```

#### `pushChannelEvent`

Push an event with a payload. Phoenix handles via `handle_in/3`

#### `leaveChannel`

Leave the channel

### Phoenix Presence

```typescript
import { useSocket, useChannels, usePresence } from 'phoenix-hooks'

const { socket } = useSocket(`//localhost:4000/socket`) // Optional, see Provider
const { channel } = useChannels(`chat:${123}`, {socket: socket})
const { handlePresenceSync } = usePresence(channel)
```

#### `usePresence`
Use Phoenix Presence for a given channel.

#### Arguments
* `channel`: `Channel` Channel from a previous `useChannels` call

#### `presence`
The underlying Phoenix Presence class.

#### `handlePresenceSync`

Handle callback on sync.

##### Example
```typescript
const [editors, setEditors] = useState([])

useEffect(() => {
  handlePresenceSync(users => {
    setEditors(users.sort((u1, u2) => {
      return u1.metas[0].online_at > u2.metas[0].online_at
    }))
  })
}, [handlePresenceSync])
```

#### `handlePresenceJoin`

Handle callback upon `presence_diff` join

#### `handlePresenceLeave`

Handle callback upon `presence_diff` leave

### Provider

```typescript jsx
import { PhoenixSocketProvider } from 'phoenix-hooks'

function App() {
  return (
    <PhoenixSocketProvider url={`//localhost:4000/socket`}>
      {/* Your component */}
    </PhoenixSocketProvider>
  )
}
```

#### Attributes
* `url`: `string`
  * `wss://localhost:4000/socket`
  * `ws://localhost:4000/socket`
  * `localhost:4000/socket`
  * `/socket`
* `opts`: `SocketOptions`

```typescript
type SocketOptions = {
  binaryType: BinaryType;
  params: object | (() => object);
  transport: string;
  timeout: number;
  heartbeatIntervalMs: number;
  longpollerTimeout: number;
  encode: (payload: object, callback: (encoded: any) => void) => void;
  decode: (payload: string, callback: (decoded: any) => void) => void;
  logger: (kind: string, message: string, data: any) => void;
  reconnectAfterMs: (tries: number) => number;
  rejoinAfterMs: (tries: number) => number;
  vsn: string;
  onOpen: () => void;
  onClose: () => void;
  onError: (any) => void;
}
```
## License

[MIT](./LICENSE)
