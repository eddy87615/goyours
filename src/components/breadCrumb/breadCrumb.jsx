/* eslint-disable react/prop-types */
import { FaHome } from 'react-icons/fa';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';

import './breadCrumb.css';

export default function BreadCrumb({ paths }) {
  return (
    <nav className="breadCrumb">
      <ul>
        <li>
          <a href="/">
            <FaHome />
          </a>
          {paths.length > 0 && <MdOutlineKeyboardArrowRight />}
        </li>
        {paths.map((path, index) => (
          <li key={index}>
            {path.url ? (
              <a href={path.url}>{path.name}</a>
            ) : path.onClick ? (
              <a onClick={path.onClick}>{path.name}</a>
            ) : (
              <span>{path.name}</span>
            )}
            {index < paths.length - 1 && <MdOutlineKeyboardArrowRight />}
          </li>
        ))}
      </ul>
    </nav>
  );
}
