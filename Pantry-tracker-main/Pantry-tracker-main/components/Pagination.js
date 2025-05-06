'use client';
import {Button} from '@mui/material';
import { useRouter } from 'next/navigation';

export default function Pagination ({ currentPage, setCurrentPage, totalItems, pageSize }) {
  const router = useRouter();
  const totalPages = Math.ceil(totalItems / pageSize);
  
    const handlePageChange = (page) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    };
   
  
  return (
    <div className="flex justify-center items-center space-x-2 mt-4">
    <Button
      onClick={() => handlePageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
    >
      Prev
    </Button>
    <Button
      onClick={() => handlePageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
    >
      Next
    </Button>
  </div>
  );
    
}