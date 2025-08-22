import { useSearchParams } from "next/navigation";

const useQueryParams = () => {
  const searchParams = useSearchParams();

  const queryParams = Object.fromEntries(searchParams.entries());

  return queryParams;
};

export default useQueryParams;
