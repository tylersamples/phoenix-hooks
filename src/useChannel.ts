import React, {useState} from 'react'

import {useSocket} from './index'

type ChannelOptions = {
  onClose?: (event: any) => void;
  onError?: (event: any) => void;
  onLeave?: (event: any) => void;
  onJoin?: (event: any) => void;
}

export function useChannel(channelName: string, props: any) {
  const [readyState, setReadyState] = useState({})


  const {socket} = useSocket()

  // OnError
  // OnClose



  const channel: any = socket.channel(channelName, props)
}
