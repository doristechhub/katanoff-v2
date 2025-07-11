import { Helmet } from 'react-helmet-async';

import { ReturnsPage } from 'src/sections/returns';

// ----------------------------------------------------------------------

export default function Returns() {
  return (
    <>
      <Helmet>
        <title> Returns | Katanoff </title>
      </Helmet>

      <ReturnsPage />
    </>
  );
}
