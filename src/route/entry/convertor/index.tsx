import {createFFmpeg, fetchFile} from '@ffmpeg/ffmpeg'
import {DownloadOutlined, LoadingOutlined, CloseCircleFilled} from '@ant-design/icons'
import {Button} from 'antd'
import {useMount, useReducer} from '~/util'

import style from './style.less'


export default React.memo(function(props: Props) {
  const {file} = props

  const [state, dispatch] = useReducer({
    raw: '',
    loading: false,
    done: false,
    url: ''
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

    dispatch({loading: false, url: URL.createObjectURL(new Blob([data.buffer]))})

    return () => URL.revokeObjectURL(state.url)
  })

  const tap = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget

    switch (target.dataset.name) {
      case 'btn:download': {
        const a = document.createElement('a')
        a.href = state.url
        a.download = file.name
        a.click()
        break
      }
    }
  }

  return <section className={style.root}
    style={{...props.style, backgroundImage: `url(${state.raw})`}}
  >
    {state.loading && <div className={style.loading}>
      <LoadingOutlined style={{color: '#fff', fontSize: 32}}/>
    </div>}
    {state.url && <div className={style.download}>
      <Button icon={<DownloadOutlined/>}
        type="link"
        data-name="btn:download"
        onClick={tap}
      >下载</Button>
    </div>}
    {state.url && <CloseCircleFilled className={style.close}
      onClick={props.close}
    />}
  </section>
})

interface Props extends React.PropsWithChildren<{}> {
  file: File
  index: number
  style?: React.CSSProperties
  success?: () => void
  close?: () => void
}
