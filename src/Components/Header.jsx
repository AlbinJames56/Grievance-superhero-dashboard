import React from 'react'
import Container from 'react-bootstrap/Container'; 
import Navbar from 'react-bootstrap/Navbar'; 
function Header() {
  return (
    <div> 
        <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">Minnal murali dashboard</Navbar.Brand>
        
         
      </Container>
    </Navbar>
    </div>
  )
}

export default Header