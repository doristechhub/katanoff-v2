import { Helmet } from 'react-helmet-async';

import { ReturnsPage } from 'src/sections/returns';

// ----------------------------------------------------------------------

export default function Returns() {
  return (
    <>
      <Helmet>
        <title> Returns | Katan Off </title>
      </Helmet>

      <ReturnsPage />
    </>
  );
}
