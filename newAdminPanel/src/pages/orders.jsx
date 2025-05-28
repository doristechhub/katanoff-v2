import { Helmet } from 'react-helmet-async';

import { OrdersPage } from 'src/sections/orders';

// ----------------------------------------------------------------------

export default function Orders() {
  return (
    <>
      <Helmet>
        <title> Orders | Katan Off </title>
      </Helmet>

      <OrdersPage />
    </>
  );
}
