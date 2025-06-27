import { Helmet } from 'react-helmet-async';

import { DiscountsView } from 'src/sections/discounts/view';

// ----------------------------------------------------------------------

export default function DiscountsPage() {
  return (
    <>
      <Helmet>
        <title> Discounts | Katan Off </title>
      </Helmet>

      <DiscountsView />
    </>
  );
}
