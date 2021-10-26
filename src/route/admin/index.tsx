import {Tabs, Card, message} from 'antd'
import {Carousel} from 'react-responsive-carousel'
import {DeleteOutlined, EditOutlined, EllipsisOutlined} from '@ant-design/icons'

import * as api from '~/api'
import {useMount, useReducer} from '~/util'

import style from './style.less'

type Tour = Unpack<typeof api.tour.get>['data'][0]

export default React.memo(function() {
  const [state, dispatch] = useReducer({
    tabs: ['游', '记'] as const,
    tours: [] as Tour[]
  })

  useMount(() => {
    api.tour.get().then(([data, err]) => {
      if (err) return message.error(err.message)
      dispatch({tours: data.data})
    })
  })

  return <section className={style.root}>
    <Tabs tabPosition="left" style={{height: '100%'}}>
      {
        state.tabs.map((id, i) => {
          if (i === 0) {
            return <Tabs.TabPane key={i} tab={id} style={{paddingLeft: 0}}>
              <section className={style.panel}>
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
                          <EditOutlined/>,
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
              </section>
            </Tabs.TabPane>
          }
          return <Tabs.TabPane key={i} tab={id}>
            {id}
          </Tabs.TabPane>
        })
      }
    </Tabs>
  </section>
})
