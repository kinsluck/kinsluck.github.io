import React from 'react'
import { FaBars } from 'react-icons/fa'
import Links from '../constants/links'
import logo from '../assets/logo.png'
import '../css/navbar.css'

const Navbar = ({ toggle }) => {
  return (
    <div className="navbar-wrapper">
      <nav className="navbar">
        <div className="nav-center">
          <div className="nav-header">
            <a href="/" className="nav-logo not-blue">
              <img src={logo.src} alt="Passion in Life" width="100" height="100" />
              <div className="logo-text">
                <span className="nav-word-open">Passion</span>{' '}
                <span className="nav-word-ed">in Life</span>
              </div>
            </a>

            <button
              className="toggle-btn"
              onClick={toggle}
              aria-label="Expand Menu"
            >
              <FaBars></FaBars>
            </button>
          </div>

          <Links styleClass="nav-links" />
          <a
            className="support-us-link not-blue"
            rel="noreferrer noopener"
            href="/about"
          >
            关于我
          </a>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
