import { ReturnHistoryPage } from "@/components/dynamiComponents";
import CommonBgHeading from "@/components/ui/CommonBgHeading";
import React from "react";

const ReturnHistory = () => {
  return (
    <div className="pt-12">
      <CommonBgHeading title="Return History" />
      <ReturnHistoryPage />
    </div>
  );
};

export default ReturnHistory;
