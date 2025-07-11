import { Helmet } from 'react-helmet-async';

import { ShowCaseBanner } from 'src/sections/showcase-banner';

// ----------------------------------------------------------------------

export default function ShowCaseBannerPage() {
  return (
    <>
      <Helmet>
        <title> ShowCase Banner | Katanoff </title>
      </Helmet>

      <ShowCaseBanner />
    </>
  );
}
