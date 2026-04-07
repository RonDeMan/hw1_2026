interface PaginationProps {
  currentPage: number
  totalPages: number
  onChange: (page: number) => void
}

function getPageNumbers(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  if (currentPage < 3) {
    return [1, 2, 3, 4, 5]
  }

  if (currentPage <= totalPages - 2) {
    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ]
  }

  return [
    totalPages - 4,
    totalPages - 3,
    totalPages - 2,
    totalPages - 1,
    totalPages,
  ].filter((value) => value >= 1)
}

function Pagination({ currentPage, totalPages, onChange }: PaginationProps) {
  const pageNumbers = getPageNumbers(currentPage, totalPages)

  return (
    <div className="pagination" role="navigation" aria-label="Pagination">
      <button
        name="first"
        disabled={currentPage === 1}
        onClick={() => onChange(1)}
      >
        First
      </button>
      <button
        name="previous"
        disabled={currentPage === 1}
        onClick={() => onChange(Math.max(1, currentPage - 1))}
      >
        Previous
      </button>
      {pageNumbers.map((page) => (
        <button
          key={page}
          name={`page-${page}`}
          className={page === currentPage ? 'active-page' : ''}
          disabled={page === currentPage}
          onClick={() => onChange(page)}
        >
          {page}
        </button>
      ))}
      <button
        name="next"
        disabled={currentPage === totalPages}
        onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
      >
        Next
      </button>
      <button
        name="last"
        disabled={currentPage === totalPages}
        onClick={() => onChange(totalPages)}
      >
        Last
      </button>
    </div>
  )
}

export default Pagination
