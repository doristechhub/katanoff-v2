import { Helmet } from 'react-helmet-async';

import { ReportAnalysisPage } from 'src/sections/report-analysis';

// ----------------------------------------------------------------------

export default function ReportAndAnalysisPage() {
  return (
    <>
      <Helmet>
        <title> Report & Analysis | Katanoff </title>
      </Helmet>

      <ReportAnalysisPage />
    </>
  );
}
