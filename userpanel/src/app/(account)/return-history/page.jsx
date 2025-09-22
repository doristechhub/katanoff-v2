import { ReturnHistoryPage } from "@/components/dynamiComponents";
import CommonBgHeading from "@/components/ui/CommonBgHeading";

const ReturnHistory = () => {
  return (
    <div className="sm:pt-12">
      <h1 className="hidden">Return History</h1>
      <CommonBgHeading
        title="Return History"
        titleClassName="!text-[26px] md:!text-3xl"
      />
      <ReturnHistoryPage />
    </div>
  );
};

export default ReturnHistory;
