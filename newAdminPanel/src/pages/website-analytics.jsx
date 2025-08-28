import { Helmet } from 'react-helmet-async';

import { WebsiteAnalytics } from 'src/sections/website-analytics';

// ----------------------------------------------------------------------

export default function WebsiteAnalyticsPage() {
  return (
    <>
      <Helmet>
        <title>Website Analytics | Katanoff </title>
      </Helmet>

      <WebsiteAnalytics />
    </>
  );
}
