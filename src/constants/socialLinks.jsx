import React from 'react'
import { FaGithubSquare, FaEnvelopeSquare } from 'react-icons/fa'
import '../css/social-links.css'

const SocialLinks = () => {
  return (
    <div className="social-links-wrapper">
      <ul className="nav-icons">
        <li>
          <a
            href="https://github.com/kinsluck"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <FaGithubSquare className="social-icon github-icon"></FaGithubSquare>
          </a>
        </li>
        <li>
          <a href="mailto:kins36936@gmail.com" aria-label="Email">
            <FaEnvelopeSquare className="social-icon"></FaEnvelopeSquare>
          </a>
        </li>
      </ul>
    </div>
  )
}

export default SocialLinks
