import { Helmet } from 'react-helmet-async';

import { Collection } from 'src/sections/collection';

// ----------------------------------------------------------------------

export default function SliderViewAddPage() {
  return (
    <>
      <Helmet>
        <title> Collection | Katan Off </title>
      </Helmet>

      <Collection />
    </>
  );
}
