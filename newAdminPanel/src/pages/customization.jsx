import { Helmet } from 'react-helmet-async';

import { Customization } from 'src/sections/customization';

// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title> Customization | Katanoff </title>
      </Helmet>

      <Customization />
    </>
  );
}
