import {createFFmpeg, fetchFile} from '@ffmpeg/ffmpeg'
import {useMount, useReducer} from '~/util'

import style from './style.less'

const ff = createFFmpeg({log: true})

export default React.memo(function({file}: Props) {
  const [state, dispatch] = useReducer({
    raw: ''
  })

  useMount(() => {
    dispatch({raw: URL.createObjectURL(file)})
  })

  useMount(async () => {
    await ff.load()
    ff.FS('writeFile', file.name, await fetchFile(file))
    await ff.run('-i', file.name, `out.${file.name}`)
    const data = ff.FS('readFile', `out.${file.name}`)
    console.log(data.byteLength)
  })

  return <section className={style.root}
    style={{backgroundImage: `url(${state.raw})`}}
  >
  </section>
})

interface Props extends React.PropsWithChildren<{}> {
  file: File
}
