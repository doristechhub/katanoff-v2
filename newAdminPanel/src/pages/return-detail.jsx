import { Helmet } from 'react-helmet-async';

import { ReturnsDetailPage } from 'src/sections/return-detail';

// ----------------------------------------------------------------------

export default function ReturnDetail() {
  return (
    <>
      <Helmet>
        <title> Return Detail | Katanoff </title>
      </Helmet>

      <ReturnsDetailPage />
    </>
  );
}
