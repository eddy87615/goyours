import './pagination.css';
import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6';

/* eslint-disable react/prop-types */
export default function Pagination({ totalPages, currentPage, onPageChange }) {
  const pageNumbers = [];

  if (totalPages <= 4) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    if (currentPage === 1) {
      pageNumbers.push(1, 2, 3, '...', totalPages);
    } else if (currentPage === totalPages) {
      pageNumbers.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
    } else if (currentPage >= 2 && currentPage <= totalPages - 1) {
      if (currentPage === 2) {
        pageNumbers.push(1, 2, 3, '...', totalPages);
      } else if (currentPage === totalPages - 1) {
        pageNumbers.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages
        );
      }
    }
  }

  return (
    <div className="pagination">
      {currentPage > 1 && (
        <a onClick={() => onPageChange(currentPage - 1)}>
          <FaArrowLeftLong />
        </a>
      )}
      {pageNumbers.map((number, index) => (
        <a
          key={index}
          onClick={() => typeof number === 'number' && onPageChange(number)}
          className={currentPage === number ? 'active' : ''}
          disabled={number === '...'}
        >
          {number}
        </a>
      ))}
      {currentPage < totalPages && (
        <a onClick={() => onPageChange(currentPage + 1)}>
          <FaArrowRightLong />
        </a>
      )}
    </div>
  );
}