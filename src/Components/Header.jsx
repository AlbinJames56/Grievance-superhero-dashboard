import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import "./header.css";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
function Header() {
  const navigate = useNavigate();
  const handleLogout = () => {
    sessionStorage.removeItem("SuperHeroToken");
    navigate("/login");
  };
  return (
    <div>
      <Navbar expand="lg" className="fw-bolder  navbar">
        <Container>
          <Navbar.Brand href="home" className="heading text-light">
            Minnal Murali Dashboard
          </Navbar.Brand>
          <Button variant="outline-warning" onClick={handleLogout}>
            Logout
          </Button>
        </Container>
      </Navbar>
    </div>
  );
}

export default Header;
