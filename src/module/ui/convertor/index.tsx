import {createFFmpeg, fetchFile} from '@ffmpeg/ffmpeg'
import {LoadingOutlined} from '@ant-design/icons'
import {useMount, useReducer} from '~/util'

import style from './style.less'


export default React.memo(function(props: Props) {
  const {file} = props

  const [state, dispatch] = useReducer({
    raw: '',
    loading: false
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
      await ff.run('-i', get, '-vf', 'palettegen=max_colors=256:stats_mode=single', '-y', out)
      await ff.run('-i', get, '-i', out, '-lavfi', '[0][1:v] paletteuse', '-pix_fmt', 'pal8', '-y', out)
    } else await ff.run('-i',  get, '-y', out)
    const data = ff.FS('readFile', out)
    // const a = document.createElement('a')
    // a.href = URL.createObjectURL(new Blob([data.buffer]))
    // a.download = 'test.png'
    // a.click()
    dispatch({loading: false})
  })

  return <section className={style.root}
    style={{...props.style, backgroundImage: `url(${state.raw})`}}
  >
    {state.loading && <div className={style.loading}>
      <LoadingOutlined style={{color: '#fff', fontSize: 32}}/>
    </div>}
  </section>
})

interface Props extends React.PropsWithChildren<{}> {
  file: File
  index: number
  style?: React.CSSProperties
  success?: () => void
}
