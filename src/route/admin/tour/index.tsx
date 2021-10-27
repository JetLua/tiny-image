import {message, Card, Modal, Form, Input} from 'antd'
import {Carousel} from 'react-responsive-carousel'
import {DeleteOutlined, EditOutlined, EllipsisOutlined, EnvironmentTwoTone} from '@ant-design/icons'

import {useMount, useReducer} from '~/util'
import * as api from '~/api'
import {AMap} from '~/module'
import type {AMapRef} from '~/module'

import style from './style.less'

type Tour = Unpack<typeof api.tour.get>['data'][0]

export default React.memo(function(props: Props) {
  const [state, dispatch] = useReducer({
    tours: [] as Tour[]
  })

  const dialog = React.useRef<DialogRef>({})

  useMount(() => {
    api.tour.get().then(([data, err]) => {
      if (err) return message.error(err.message)
      dispatch({tours: data.data})
    })
  })

  const onClick = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget
    switch (target.dataset.name) {
      case 'edit': {
        dialog.current.show({title: '编辑'})
        break
      }
    }
  }

  return <section className={style.panel}>
      <section className={style.grid}>
        {
          state.tours.map((tour, j) => {
            const cover = <Carousel infiniteLoop autoPlay key={j} showThumbs={false}>
              {
                tour.imgs.map((item, k) => {
                  return <div key={k} style={{backgroundImage: `url(${item})`}}
                    className={style.cover}
                  ></div>
                })
              }
            </Carousel>

            return <Card key={j}
              className={style.card}
              cover={cover}
              actions={[
                <EditOutlined onClick={onClick} data-name="edit"/>,
                <DeleteOutlined/>,
                <EllipsisOutlined/>
              ]}
            >
              <Card.Meta
                title={tour.title}
                description={tour.desc}
              />
            </Card>
          })
        }
      </section>
      <Dialog ref={dialog}/>
    </section>
})

interface Props {

}


const Dialog = React.memo(React.forwardRef<DialogRef>(function(props, ref: React.MutableRefObject<DialogRef>) {
  const [state, dispatch] = useReducer({
    title: '',
    visible: false
  })

  const mapRef = React.useRef<AMapRef>({})

  useMount(() => {
    ref.current.show = (opts: {title: string}) => {
      dispatch({visible: true, title: opts.title})
    }
  })

  const onOk = () => {

  }

  const onCancel = () => {
    dispatch({visible: false})
  }

  const onClick = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget

    switch (target.dataset.name) {
      case 'map': {
        mapRef.current.show()
        break
      }
    }
  }

  return <Modal visible={state.visible}
    onCancel={onCancel}
    onOk={onOk}
    title={state.title}
  >
    <Form layout="vertical">
      <Form.Item label="标题" required><Input/></Form.Item>
      <Form.Item label="描述"><Input.TextArea/></Form.Item>
      <Form.Item label="图片"></Form.Item>
      <Form.Item label="经纬度"><Input
        addonAfter={<EnvironmentTwoTone onClick={onClick} data-name="map"/>}
      /></Form.Item>
      <Form.Item label="地点"><Input/></Form.Item>
    </Form>

    <AMap ref={mapRef}/>
  </Modal>
}))

interface DialogProps {

}

interface DialogRef {
  show?: (opts: {title: string}) => void
}
