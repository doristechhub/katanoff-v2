import { AppointmentCustomJewelryPage } from "@/components/dynamiComponents";
import CustomTabs from "@/components/ui/CustomTabs";
import CustomJewelry from "@/components/ui/CustomJewelry";

const AppointmentCustomJewelry = () => {
  const tabs = [
    {
      eventKey: "onlineAppointment",
      title: "Online Appointments",
      child: <AppointmentCustomJewelryPage />,
    },
    {
      eventKey: "customJewelry",
      title: "Custom Jewelry",
      child: <CustomJewelry />,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-20">
      <CustomTabs childs={tabs} defaultActiveKey="onlineAppointment" />
    </div>
  );
};

export default AppointmentCustomJewelry;
