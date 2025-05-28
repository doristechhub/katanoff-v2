import { Helmet } from 'react-helmet-async';

import { MenuView } from 'src/sections/menu';

// ----------------------------------------------------------------------

export default function MenuPage() {
  return (
    <>
      <Helmet>
        <title> Menu | Katan Off </title>
      </Helmet>

      <MenuView />
    </>
  );
}
