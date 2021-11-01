import {Button} from 'antd'
import {UploadOutlined} from '@ant-design/icons'

import {Convertor} from '~/module/ui'
import {useMount, useReducer} from '~/util'
import style from './style.less'

export default React.memo(function() {
  const [state, dispatch] = useReducer({
    files: [] as File[]
  })

  const tap = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget

    switch (target.dataset.name) {
      case 'btn:choose': {
        const input = document.createElement('input')
        input.multiple = true
        input.type = 'file'
        // input.webkitdirectory = true
        input.accept = 'image/*'
        input.click()
        input.onchange = async () => {
          const files = []
          for (let i = 0; i < input.files.length; i++) {
            const file = input.files.item(i)
            if (!file.type.startsWith('image')) continue
            // const url = URL.createObjectURL(file)
            files.push(file)
          }
          dispatch({files})
        }
        break
      }
    }
  }

  return <section className={style.root} onClick={tap}>
    <section className={style.action}>
      <Button type="primary"
        icon={<UploadOutlined/>}
        onClick={tap}
        data-name="btn:choose"
        className={style.btn}
      >选择图片</Button>
    </section>
    <section className={style.gallery}>
      {
        state.files.map((file, i) => {
          return <Convertor key={i} file={file}/>
        })
      }
    </section>
  </section>
})
