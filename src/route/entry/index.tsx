import {Button} from 'antd'
import JSZip from 'jszip'
import {UploadOutlined, DownloadOutlined} from '@ant-design/icons'

import Convertor from './convertor'
import {save, useMount, useReducer} from '~/util'
import style from './style.less'

export default React.memo(function() {
  const [state, dispatch] = useReducer({
    files: [] as {file: File, compressed?: Uint8Array}[],
    height: 0,

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
        input.accept = 'image/*'
        input.click()
        input.onchange = async () => {
          const files = state.files
          loop: for (let i = 0; i < input.files.length; i++) {
            const file = input.files.item(i)
            for (const f of files) if (same(f.file, file)) continue loop
            if (!file.type.startsWith('image')) continue
            files.push({file})
          }
          dispatch({files})
        }
        break
      }

      case 'btn:download': {
        const zip = new JSZip()

        for (const item of state.files) {
          if (!item.compressed) continue
          zip.file(item.file.name, item.compressed)
        }

        zip.generateAsync({type: 'blob'}).then(data => {
          save('compressed.zip', data)
        })
        break
      }
    }
  }

  const same = (a: File, b: File) => {
    if (a.lastModified === b.lastModified &&
      a.type === b.type) return true
  }

  const {files} = state

  return <section className={style.root}>
    <section className={style.main}>
      <section className={style.action}>
        <Button type="primary"
          icon={<UploadOutlined/>}
          onClick={tap}
          data-name="btn:choose"
          className={style.btn}
        >选择图片</Button>
        {files.length > 0 && files.filter(item => item.compressed).length === files.length && <Button
          type="default"
          onClick={tap}
          data-name="btn:download"
          icon={<DownloadOutlined/>}
          style={{marginLeft: 12}}
        >下载全部(.zip)</Button>}
      </section>
      <section className={style.gallery}
        ref={domRef}
      >
        {
          files.map((item, i) => {
            return <Convertor
              key={i}
              file={item.file}
              index={i}
              style={{height: state.height}}
              close={() => {
                dispatch({
                  files: files.filter(({file}) => file !== item.file)
                })
              }}
              success={(data: Uint8Array) => {
                item.compressed = data
                dispatch({files: files})
              }}
            />
          })
        }
      </section>
    </section>
  </section>
})
