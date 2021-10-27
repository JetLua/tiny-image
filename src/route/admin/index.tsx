import {Tabs} from 'antd'

import Tour from './tour'
import Diary from './diary'
import * as api from '~/api'
import {useMount, useReducer} from '~/util'

import style from './style.less'


export default React.memo(function() {
  const [state, dispatch] = useReducer({
    tabs: ['游', '记'] as const,
  })

  return <section className={style.root}>
    <Tabs tabPosition="left" style={{height: '100%'}}>
      {
        state.tabs.map((id, i) => {
          return <Tabs.TabPane key={i} tab={id} style={{paddingLeft: 0}}>
            {i === 0 && <Tour/>}
            {i === 1 && <Diary/>}
          </Tabs.TabPane>
        })
      }
    </Tabs>
  </section>
})
