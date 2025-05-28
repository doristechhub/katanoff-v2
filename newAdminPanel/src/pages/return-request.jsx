import { Helmet } from 'react-helmet-async';

import { ReturnRequestPage } from 'src/sections/return-request';

// ----------------------------------------------------------------------

export default function ReturnRequest() {
  return (
    <>
      <Helmet>
        <title> Return Request | Katan Off </title>
      </Helmet>

      <ReturnRequestPage />
    </>
  );
}
