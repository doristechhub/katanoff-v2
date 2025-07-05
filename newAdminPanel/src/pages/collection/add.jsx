import { Helmet } from 'react-helmet-async';
import { AddCollection } from 'src/sections/collection/add';

// ----------------------------------------------------------------------

export default function AddCollectionPage() {
  return (
    <>
      <Helmet>
        <title> Collections | Katan Off </title>
      </Helmet>

      <AddCollection />
    </>
  );
}
