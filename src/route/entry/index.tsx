import {Button} from 'antd'
import JSZip from 'jszip'
import {ExperimentOutlined, DownloadOutlined} from '@ant-design/icons'

import Convertor from './convertor'
import {save, useMount, useReducer} from '~/util'
import style from './style.less'

export default React.memo(function() {
  const [state, dispatch] = useReducer({
    files: [] as {file: File, compressed?: Uint8Array}[],
    height: 0,

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

  const onDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault()

    const {files} = e.dataTransfer
    const list: {file: File}[] = []

    loop: for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const type = file.type.replace('image/', '')
      for (const f of state.files) if (same(f.file, file)) continue loop
      if (type === 'png' || type === 'jpg' || type === 'jpeg') {
        list.push({file})
      }
    }

    dispatch({files: list})
  }

  const onDragOver = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault()
  }

  return <section className={style.root}>
    <section className={style.main}>
      <section className={style.action}>
        <div className={style.acceptor}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onClick={tap}
          data-name="btn:choose"
        >
          <ExperimentOutlined
            style={{fontSize: 32, color: '#009688'}}
          />
          <p>点击选择或者拖拽上传图片</p>
        </div>
        {files.length > 0 && files.filter(item => item.compressed).length === files.length && <Button
          type="primary"
          onClick={tap}
          data-name="btn:download"
          icon={<DownloadOutlined/>}
          style={{marginTop: 12}}
        >下载全部(.zip)</Button>}
      </section>
      <section className={style.gallery}>
        {
          files.map((item, i) => {
            return <Convertor
              key={i}
              file={item.file}
              index={i}
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
