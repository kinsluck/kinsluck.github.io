import React from 'react'

const Links = ({ styleClass, children }) => {
  return (
    <ul className={styleClass}>
      <li>
        <a href="/" className="page-link">
          首页
        </a>
      </li>
      <li>
        <a href="/categories" className="page-link">
          分类
        </a>
      </li>
      <li>
        <a href="/about" className="page-link">
          关于
        </a>
      </li>
    </ul>
  )
}

export default Links
