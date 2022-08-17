import React from 'react'
import {Col, Grid} from 'rsuite';
import Sidebar from '../components/Sidebar';

export default function Home() {
  return (
    <Grid fluid className='h-100'>
      <Col xs={24} md={8}>
        <Sidebar />
      </Col>
    </Grid>
  )
}
