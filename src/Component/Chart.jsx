import {
  lightningChart, AxisScrollStrategies, AxisTickStrategies, UIElementBuilders, Themes, IndividualPointFill, emptyLine,
  PointShape
} from '@arction/lcjs'
import { useRef, useEffect } from 'react'
import { io } from 'socket.io-client'

// total time since 1970 in ms
const timeBeginInMS = new Date()
// total time of the day in ms (from 00:00:00 to 23:59:59)
const timeBegin = new Date().getHours() * 3600 * 1000 + new Date().getMinutes() * 60 * 1000 + new Date().getSeconds() * 1000 + new Date().getMilliseconds()

const Chart = ({ data, id }) => {

  const chartRef = useRef(undefined)

  useEffect(() => {
    // Create chart, series and any other static components.
    // NOTE: console log is used to make sure that chart is only created once, even if data is changed!
    console.log('create chart')

    // Create a XY Chart.
    const chart = lightningChart()
      .ChartXY({
        theme: Themes.light,
        container: id,
      })
      .setTitle('Timeseries Chart')


    // Create line series optimized for regular progressive X data.
    const series = chart.addPointLineSeries({
      pointShape: PointShape.Circle,
      dataPattern: {
        //   // pattern: 'ProgressiveX' => Each consecutive data point has increased X coordinate.
        pattern: 'ProgressiveX',
        //   // regularProgressiveStep: true => The X step between each consecutive data point is regular (for example, always `1.0`).
        //   regularProgressiveStep: true,
      },
    })
      .setPointSize(5)


    // Setting for Data Cleaning.
    // 10 Mins * 60 Secs * 1000 Millisecs / 5 Millisecs = 1200000 data points
    series.setDataCleaning({
      minDataPointCount: 10 * 60 * 10000 / 5,
    })
    // Setting for X Axis.
    const axisX = chart
      .getDefaultAxisX()
      // Enable TimeTickStrategy for X Axis for ms resolution.
      .setTickStrategy(AxisTickStrategies.Time, (tickStrategy) => tickStrategy.setTimeOrigin(timeBegin))
      .setStrokeStyle(emptyLine)
      // Enable Progressive Scroll Strategy for X Axis.
      .setScrollStrategy(AxisScrollStrategies.progressive)

    // Setting for Y Axis.
    chart.getDefaultAxisY().setTitle('Y Axis')

    // Setting for Cursor.
    chart.setAutoCursor((cursor) =>
      cursor.setResultTableAutoTextStyle(true).setTickMarkerXAutoTextStyle(true).setTickMarkerYAutoTextStyle(true),
    )

    // Store references to chart components.
    chartRef.current = { chart, series }

    // Return function that will destroy the chart when component is unmounted.
    return () => {
      // Destroy chart.
      console.log('destroy chart')
      chart.dispose()
      chartRef.current = undefined
    }
  }, [id])


  useEffect(() => {
    const components = chartRef.current
    if (!components) return

    // Set chart data.
    const { series, chart } = components
    // Set default view
    chart.zoom({ x: -200, y: 180 }, { x: 500, y: 500 })

    // Connect to socket.io server
    const socket = io('http://localhost:8080')
    socket.on('data', (data) => {
      // timestamp in ms
      // data.x is timestamp of the data point in ms since 1970
      // data.x - timeBeginInMS is timestamp of the data point in ms since the beginning of the day
      // will fit into the origin of the X Axis
      const timeStamp = data.x - timeBeginInMS
      series.add({ x: timeStamp, y: data.y })
    })

  }, [data, chartRef])

  return <div id={id} className="chart-container"></div>
}

export default Chart
