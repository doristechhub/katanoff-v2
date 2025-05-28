import { Helmet } from 'react-helmet-async';

import { ReportAnalysisPage } from 'src/sections/report-analysis';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> Report & Analysis | Katan Off </title>
      </Helmet>

      <ReportAnalysisPage />
    </>
  );
}
