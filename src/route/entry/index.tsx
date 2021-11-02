import {Button} from 'antd'
import {UploadOutlined, DownloadOutlined} from '@ant-design/icons'

import Convertor from './convertor'
import {useMount, useReducer} from '~/util'
import style from './style.less'

export default React.memo(function() {
  const [state, dispatch] = useReducer({
    files: [] as File[],
    height: 0
  })

  const domRef = React.useRef<HTMLElement>()

  useMount(() => {
    dispatch({height: (domRef.current.offsetWidth - 3 * 2) / 4})
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

  return <section className={style.root}>
    <section className={style.main}>
      <section className={style.action}>
        <Button type="primary"
          icon={<UploadOutlined/>}
          onClick={tap}
          data-name="btn:choose"
          className={style.btn}
        >选择图片</Button>
        <Button
          type="default"
          icon={<DownloadOutlined/>}
          style={{marginLeft: 12}}
        >下载全部</Button>
      </section>
      <section className={style.gallery}
        ref={domRef}
      >
        {
          state.files.map((file, i) => {
            return <Convertor
              key={i}
              file={file}
              index={i}
              style={{height: state.height}}
              close={() => {
                dispatch({
                  files: state.files.filter(item => item !== file)
                })
              }}
            />
          })
        }
      </section>
    </section>
  </section>
})
