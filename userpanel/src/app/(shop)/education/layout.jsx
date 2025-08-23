import { generateMetadata } from "@/_utils/metaConfig";
import { META_CONSTANTS } from "@/_helper";

export const metadata = generateMetadata({
    pageName: [META_CONSTANTS.EDUCATION],
});

export default function EducationLayout({ children }) {
    return <div>{children}</div>;
}
