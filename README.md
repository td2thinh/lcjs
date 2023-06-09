<br/>
<p align="center">
  <a href="https://github.com/td2thinh/lcjs">
  </a>

  <h3 align="center">React App implementing Lightning Chart JS for live streaming data from IOT devices</h3>

</p>

## Lesson Learned

Set up live streaming chart using Lightning Chart JS which offers WebGL rendering of chart with millions of points, live data feed using WebSocket (SocketIO lib)

### Setting the right timestamp format

```js
// Save the "total" time in ms
const timeBeginSince1970 = new Date().getTime()
    
// Do this to get the time of the day in ms
const timeBegin = new Date().getHours() * 3600 * 1000 + new Date().getMinutes() * 60 * 1000 + new Date().getSeconds() * 1000 + new Date().getMilliseconds()
    
// Set the origin equal to the starting time
// DateTime min is 1 minute, need to use Time here
chart.setTickStrategy(AxisTickStrategies.Time, (tickStrategy) => tickStrategy.setTimeOrigin(timeBegin))


// Adding data to the series
const timeStamp = data.x - timeBeginInMS
series.add({ x: timeStamp, y: data.y })
```

## Built With

ReactJS, lcjs, react-bootstrap, Vite

## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

* npm


Need to have a WebSocket server running that send data in the format 
```js
 data = {
            "x": new Date().getTime(),
            "y": sensorData,
        };
        socket.emit('data', data);
```
ExpressJS SocketIO server available here https://github.com/td2thinh/socketIO-server-iot/


### Installation

1. Clone the repo

```sh
git clone https://github.com/td2thinh/lcjs.git
```

2. Install dependencies

```sh
npm install
```

## Usage
Run app
```sh
npm run dev 
```
App available at http://localhost:5173



