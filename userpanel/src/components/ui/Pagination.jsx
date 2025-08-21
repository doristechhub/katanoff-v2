import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import ReactPaginate from "react-paginate";

export default function Pagination({
  handlePageClick,
  pageCount,
  rest,
  className,
}) {
  return (
    <div className={`pt-10 md:pt-14 flex justify-center ${className}`}>
      <ReactPaginate
        previousLabel={<FaAngleLeft className="text-xl text-primary" />}
        nextLabel={<FaAngleRight className="text-xl text-primary" />}
        breakLabel={<span className="text-xl">...</span>}
        breakClassName={"text-primary"}
        pageCount={pageCount}
        marginPagesDisplayed={1}
        pageRangeDisplayed={2}
        onPageChange={handlePageClick}
        containerClassName={"flex items-center gap-2"}
        pageClassName={"px-4 py-2 rounded-md"}
        activeClassName={"bg-primary text-white rounded px-4 py-2"}
        previousClassName={"px-3 py-1 rounded-md"}
        nextClassName={"px-3 py-1 rounded-md"}
        disabledClassName={"opacity-50 cursor-not-allowed"}
        {...rest}
      />
    </div>
  );
}
