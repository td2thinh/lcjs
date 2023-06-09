import React, { useEffect, useState } from 'react';
import './App.css'
import Chart from './Component/Chart'
import { Container, Row, Col } from 'react-bootstrap'


const App = () => {
  return (
    <Container style={{
      textAlign: 'center',
    }}>
      <Row>
        <Chart id="chart" />
      </Row>
    </Container>
  )
}

export default App
