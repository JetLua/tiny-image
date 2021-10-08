import * as d3 from 'd3'
import {Button} from 'antd'
import {net, useMount, useReducer} from '~/util'

import style from './style.less'

export default React.memo(function() {
  const [state, dispatch] = useReducer({
    count: 0,
    info: {
      name: 'Jet'
    }
  })

  const svgRef = React.useRef<SVGSVGElement>()

  useMount(async () => {
    const width = 750
    const height = 750
    const data = await import('@/static/map/china.json')
    const project = d3.geoMercator().fitSize([width, height], data as any)
    const getPath = d3.geoPath(project) as any
    const colors = d3.scaleOrdinal(d3.schemeCategory10)

    const svg = d3.select(svgRef.current)

    let x = 0
    let y = 0
    let k = 1

    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height] as any)

    const g = svg.append('g')
      .selectAll('path')
      .data(data.features)
      .enter().append('path')
      .attr('d', getPath)
      .attr('fill', colors as any)
      .attr('stroke', '#fff')
      .attr('pointer-events', 'all')

    svg.call(d3.zoom().scaleExtent([1 / 2, 4]).on('zoom', (e: d3.D3ZoomEvent<any, any>) => {
      g.attr('transform', e.transform.toString())
    }))

  })


  return <section className={style.root}>
    <svg ref={svgRef} className={style.svg}></svg>
  </section>
})
