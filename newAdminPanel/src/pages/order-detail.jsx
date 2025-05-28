import { Helmet } from 'react-helmet-async';

import { OrderDetailPage } from 'src/sections/order-detail';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> Order Detail | Katan Off </title>
      </Helmet>

      <OrderDetailPage />
    </>
  );
}
