import {Button} from 'antd'
import {createFFmpeg, fetchFile} from '@ffmpeg/ffmpeg'
import {DownloadOutlined, LoadingOutlined, CloseCircleFilled} from '@ant-design/icons'

import {save, useMount, useReducer} from '~/util'

import style from './style.less'


export default React.memo(function(props: Props) {
  const {file} = props

  const [state, dispatch] = useReducer({
    raw: '',
    loading: false,
    done: false,
    url: '',
    size: 0
  })

  useMount(() => {
    dispatch({raw: URL.createObjectURL(file)})
  })

  useMount(async () => {
    dispatch({loading: true})
    const ff = createFFmpeg({log: false})
    await ff.load()
    const type = file.type.replace('image/', '')
    const get = `get.${type}`
    const out = `out.${type}`
    ff.FS('writeFile', get, await fetchFile(file))

    if (type === 'png') {
      await ff.run('-i', get, '-vf', 'palettegen=max_colors=256:stats_mode=single', '-y', `p.${out}`)
      await ff.run('-i', get, '-i', `p.${out}`, '-lavfi', '[0][1:v] paletteuse', '-pix_fmt', 'pal8', '-y', out)
    } else await ff.run('-i',  get, '-y', out)

    const data = ff.FS('readFile', out)
    const blob = new Blob([data.buffer])

    props.success(data)

    dispatch({
      loading: false,
      url: URL.createObjectURL(blob),
      size: blob.size
    })

    return () => URL.revokeObjectURL(state.url)
  })

  const tap = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget

    switch (target.dataset.name) {
      case 'btn:download': {
        save(file.name, state.url)
        break
      }
    }
  }

  return <section className={style.root}>
    <i style={{textAlign: 'left', paddingLeft: 12}}>{file.name}</i>
    <Format v={file.size}/>
    {state.url && <Format v={state.size}/>}
    {!state.url && <i><LoadingOutlined/></i>}
    {state.url && <div className={style.download}>
      <i data-name="btn:download" onClick={tap}>下载</i>
      <i onClick={props.close} style={{marginLeft: 8}}>删除</i>
    </div>}
  </section>
})

interface Props extends React.PropsWithChildren<{}> {
  file: File
  index: number
  style?: React.CSSProperties
  success?: (data: Uint8Array) => void
  close?: () => void
}

function Format({v}: {v: number}) {
  let unit = ''
  if (v >= 1024) v /= 1024, unit = 'K'
  if (v >= 1024) v /= 1024, unit = 'M'
  return <i style={{textAlign: 'left'}}>{v.toFixed(1)} {unit}</i>
}
