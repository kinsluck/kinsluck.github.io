import React from 'react'
import Links from '../constants/links'
import { IoMdClose } from 'react-icons/io'
import '../css/mobile-menu.css'

const MobileMenu = ({ isOpen, toggle }) => {
  return (
    <div className="mobile-menu-wrapper">
      <aside className={`sidebar ${isOpen ? 'showSidebar' : ''}`}>
        <button className="close-btn" onClick={toggle}>
          <IoMdClose />
        </button>
        <div className="sidebar-container">
          <Links styleClass="sidebar-links"></Links>
          <a
            className="support-us-link not-blue"
            rel="noreferrer noopener"
            href="/about"
          >
            关于我
          </a>
        </div>
      </aside>
    </div>
  )
}

export default MobileMenu
