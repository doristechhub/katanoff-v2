import { generateMetadata } from "@/_utils/metaConfig";
import { META_CONSTANTS } from "@/_helper";
export const metadata = generateMetadata({
  pageName: [META_CONSTANTS.BOOK_APPOINTMENT],
});

export default function BookAppointmentLayout({ children }) {
  return <div>{children}</div>;
}
