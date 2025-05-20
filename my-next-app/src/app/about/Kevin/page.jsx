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
            <a href='https://github.com/migatomax123'>
            <img src='https://img.freepik.com/vector-gratis/joven-camisa-negra_1308-173618.jpg?t=st=1741782088~exp=1741785688~hmac=1e11867ae2019c474c3237c5f50707fa06a11bae517d6b4f13cdb08f6a8341a7&w=740' className='img_autor'/></a>
            <hr className='hr_autor'/><h2 className='autor'>Kevin</h2>
            <hr className='hr_autor'/>
            <h3>Edad: 19 años</h3><hr className='hr_autor'/>
            <h2 className='bot_autor'><Link href="/">Inicio</Link></h2>
          </Card>
        </div>
      </div>
    </div>
  )
}