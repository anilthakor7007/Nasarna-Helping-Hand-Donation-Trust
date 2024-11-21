import React from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { CardFooter } from 'reactstrap';

const PaginationComponent = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleClick = (e, page) => {
    e.preventDefault();
    onPageChange(page);
  };

  return (
    <CardFooter className="py-4">
      <nav aria-label="Pagination">
        <Pagination className="pagination justify-content-end mb-0" listClassName="justify-content-end mb-0">
          
          {/* Previous Button */}
          <PaginationItem disabled={currentPage === 1}>
            <PaginationLink
              previous
              href="#pablo"
              onClick={(e) => handleClick(e, currentPage - 1)}
            >
              <i className="fas fa-angle-left" />
              <span className="sr-only">Previous</span>
            </PaginationLink>
          </PaginationItem>
          
          {/* Page Numbers */}
          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            return (
              <PaginationItem active={pageNumber === currentPage} key={pageNumber}>
                <PaginationLink
                  href="#pablo"
                  onClick={(e) => handleClick(e, pageNumber)}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          
          {/* Next Button */}
          <PaginationItem disabled={currentPage === totalPages}>
            <PaginationLink
              next
              href="#pablo"
              onClick={(e) => handleClick(e, currentPage + 1)}
            >
              <i className="fas fa-angle-right" />
              <span className="sr-only">Next</span>
            </PaginationLink>
          </PaginationItem>
        </Pagination>
      </nav>
    </CardFooter>
  );
};

export default PaginationComponent;
