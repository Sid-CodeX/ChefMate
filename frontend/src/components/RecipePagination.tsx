
import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface RecipePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const RecipePagination = React.memo(({ currentPage, totalPages, onPageChange }: RecipePaginationProps) => {
  const handlePageChange = React.useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  }, [onPageChange, totalPages]);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={currentPage === i}
            className="cursor-pointer"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pageNumbers;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-8">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => handlePageChange(currentPage - 1)}
              className={`cursor-pointer ${currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}`}
            />
          </PaginationItem>
          
          {currentPage > 3 && (
            <>
              <PaginationItem>
                <PaginationLink onClick={() => handlePageChange(1)} className="cursor-pointer">
                  1
                </PaginationLink>
              </PaginationItem>
              {currentPage > 4 && <PaginationEllipsis />}
            </>
          )}
          
          {renderPageNumbers()}
          
          {currentPage < totalPages - 2 && (
            <>
              {currentPage < totalPages - 3 && <PaginationEllipsis />}
              <PaginationItem>
                <PaginationLink onClick={() => handlePageChange(totalPages)} className="cursor-pointer">
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => handlePageChange(currentPage + 1)}
              className={`cursor-pointer ${currentPage === totalPages ? 'opacity-50 pointer-events-none' : ''}`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
});

RecipePagination.displayName = "RecipePagination";

export default RecipePagination;
