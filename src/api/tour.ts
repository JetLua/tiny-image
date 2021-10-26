import {net, ok, error} from '~/util'

const img = 'https://cdn.pixabay.com/photo/2021/09/15/21/29/lake-6627781_960_720.jpg'

export function get() {
  interface Tour {
    id: string
    imgs: string[]
    title: string
    desc: string
    timestamp: number
  }

  if (ENV === 'mock') return Promise.resolve([{
    total: 100,
    next: true,
    cursor: 1,
    data: [
      {
        imgs: [img, img, img],
        title: '湘湖',
        desc: '接天莲叶无穷碧'
      },
      {
        imgs: [img, img, img],
        title: '喜闻乐见',
        desc: '晓看天色暮看云'
      }
    ]
  }, null])

  return net.get<null, Respond<Tour[]>>('/api/tour').then(ok).catch(error)
}
