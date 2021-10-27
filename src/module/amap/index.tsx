import {Modal} from 'antd'
import Loader from '@amap/amap-jsapi-loader'
import {useMount, useReducer} from '~/util'

export default React.memo(React.forwardRef(function(props, ref: React.MutableRefObject<AMapRef>) {
  const [state, dispatch] = useReducer({
    visible: false
  })

  const mapRef = React.useRef<HTMLDivElement>()

  useMount(() => {
    ref.current.show = () => {
      dispatch({visible: true})
    }
  })

  useMount(() => {
    Loader.load({
      key: 'c9251e4e916a22afa112b473694a7c4f',
      version: '2.0',
    }).then(AMap => {
      new AMap.Map(mapRef.current, {
        zoom: 4,
        center: [106.715923,34.27871],
        mapStyle: 'amap://styles/31183085dfa24d811d356d439de27eee'
      }).on('click', console.log)
    })
  })

  const onOk = () => {

  }

  const onCancel = () => {
    dispatch({visible: false})
  }

  return <Modal visible={state.visible}
    destroyOnClose
    maskClosable={false}
    onCancel={onCancel}
    onOk={onOk}
    closable={false}
    title={false}
  >
    <div ref={mapRef} style={{height: 300}}></div>
  </Modal>
}))

export interface AMapRef {
  show?: () => void
}
