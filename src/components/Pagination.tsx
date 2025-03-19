
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  if (totalPages <= 1) return null;
  
  // Calculate page range to display
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);
  
  // Adjust if we're near the end
  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }
  
  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <div className="flex justify-center items-center space-x-2 my-8">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={cn(
          "p-2 rounded-md transition-all",
          currentPage === 1
            ? "text-gray-500 cursor-not-allowed"
            : "text-white hover:bg-marvel-red"
        )}
        aria-label="Previous page"
      >
        <ChevronLeft size={20} />
      </button>
      
      {startPage > 1 && (
        <>
          <PaginationButton
            page={1}
            isActive={currentPage === 1}
            onClick={() => onPageChange(1)}
          />
          {startPage > 2 && (
            <span className="px-2 text-gray-500">...</span>
          )}
        </>
      )}
      
      {pageNumbers.map(page => (
        <PaginationButton
          key={page}
          page={page}
          isActive={currentPage === page}
          onClick={() => onPageChange(page)}
        />
      ))}
      
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className="px-2 text-gray-500">...</span>
          )}
          <PaginationButton
            page={totalPages}
            isActive={currentPage === totalPages}
            onClick={() => onPageChange(totalPages)}
          />
        </>
      )}
      
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={cn(
          "p-2 rounded-md transition-all",
          currentPage === totalPages
            ? "text-gray-500 cursor-not-allowed"
            : "text-white hover:bg-marvel-red"
        )}
        aria-label="Next page"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

interface PaginationButtonProps {
  page: number;
  isActive: boolean;
  onClick: () => void;
}

const PaginationButton: React.FC<PaginationButtonProps> = ({
  page,
  isActive,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={cn(
      "h-10 w-10 rounded-md transition-all duration-200",
      isActive
        ? "bg-marvel-red text-white"
        : "text-white hover:bg-marvel-gray"
    )}
    aria-current={isActive ? "page" : undefined}
  >
    {page}
  </button>
);

export default Pagination;
