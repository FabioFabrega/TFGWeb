'use client'
import Link from "next/link";
import "../../globals.css";
import { IoPersonCircle } from "react-icons/io5";
import { Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Carrusel from "../../carrusel/page";

export default function Home() {
  return (
    <div className="global">
      <header>
        <div className="head">
          <a href="../../cesta/usuario" className="inicio"><h1>TechStore</h1></a>
          <input type="text" id="texto" name="texto" placeholder="Busca aqui..." />
          <h3><Link href="/"><IoPersonCircle />Cerrar sesión</Link></h3>
          <h3><Dropdown>
          <Dropdown.Toggle variant="success" id="cesta-basic">
            <h4>Mi cesta</h4>
          </Dropdown.Toggle>
          <Dropdown.Menu id="cesta-menu">
            <Dropdown.Item>
              
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown></h3>
        </div><hr/><nav><Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Categoría
          </Dropdown.Toggle>
          <Dropdown.Menu id="dropdown-menu">
            <Dropdown.Item href="../categoria_usuario/ordenadores">
              <button >
                Ordenadores
              </button>
            </Dropdown.Item>
            <Dropdown.Item >
              <button >
                Moviles
              </button>
            </Dropdown.Item>
            <Dropdown.Item href="../categoria_usuario/componentes">
              <button >
                Componentes
              </button>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        </nav></header>
      <main><section><div className="divC">
        </div></section></main>
    </div>
  );
}
