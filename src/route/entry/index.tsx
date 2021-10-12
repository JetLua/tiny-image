import Loader from '@amap/amap-jsapi-loader'

import {Button} from 'antd'
import {net, useMount, useReducer} from '~/util'

import style from './style.less'

export default React.memo(function() {
  const [state, dispatch] = useReducer({
    count: 0,
    info: {
      name: 'Jet'
    }
  })

  const mapRef = React.useRef<HTMLDivElement>()

  useMount(async () => {
    Loader.load({
      key: 'c9251e4e916a22afa112b473694a7c4f',
      version: '2.0',
    }).then(AMap => {
      new AMap.Map(mapRef.current, {
        mapStyle: 'amap://styles/31183085dfa24d811d356d439de27eee'
      }).on('click', console.log)
    })
  })


  return <section className={style.root}>
    <div ref={mapRef} className={style.map}></div>
  </section>
})
