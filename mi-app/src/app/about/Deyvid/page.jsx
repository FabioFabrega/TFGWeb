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
            <a href='https://github.com/Deyvid0104'>
            <img src='https://img.freepik.com/vector-gratis/ilustracion-joven-sonriente_1308-174401.jpg?t=st=1741782081~exp=1741785681~hmac=7591debe9d5d605658464d83de2a0506543d06e298c5cf6baf82097159fc1c8f&w=740' className='img_autor'/></a>
            <hr className='hr_autor'/><h2 className='autor'>Deyvid </h2>
            <hr className='hr_autor'/>
            <h3>Edad: </h3><hr className='hr_autor'/>
            <h2 className='bot_autor'><Link href="/">Inicio</Link></h2>
          </Card>
        </div>
      </div>
    </div>
  )
}
