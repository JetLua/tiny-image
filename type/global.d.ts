declare module '*.less'

declare const React = await import('react')
declare const ReactDOM = await import('react-dom')

declare const ENV: 'prod' | 'mock'
declare const PROD: boolean

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>
}

type Respond<T> = {data: T} & {
  cursor: number
  size: number
  total: number
}

// 解压提取api函数ok时的返回类型
type Unpack<T extends (...args: any[]) => void> = ReturnType<T> extends PromiseLike<infer U> ?
  Extract<U, [unknown, null]>[0] : T

// 路由格式
interface IRoute {
  path?: string
  name?: string
  exact?: boolean
  /** for sidebar */
  parent?: this
  routes?: this[]
  /**
   * Element: 左侧栏显示的菜单
   * Boolean: 是否在左侧菜单栏中显示
   */
  menu?: JSX.Element | boolean
  component?: React.FunctionComponent
}
