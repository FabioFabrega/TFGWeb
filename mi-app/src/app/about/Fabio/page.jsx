import React from 'react'
import '../estilo.css'
import Card from 'react-bootstrap/Card';
import Link from "next/link"

export default function page() {
  return (
    <div className='body_about'>
      <div>
        <div className='about'>
          <Card>
            <a href='https://github.com/FabioFabrega'>
            <img src='https://img.freepik.com/vector-gratis/ilustracion-joven-sonriente_1308-174669.jpg?semt=ais_hybrid' className='img_autor'/></a>
            <hr className='hr_autor'/><h2 className='autor'>Fabio Fabrega da Silva</h2>
            <hr className='hr_autor'/>
            <h3>Edad: 19 años</h3>
            <hr className='hr_autor'/><h2 className='bot_autor'><Link href="/">Inicio</Link></h2>
          </Card>
        </div>
      </div>
    </div>
  )
}
