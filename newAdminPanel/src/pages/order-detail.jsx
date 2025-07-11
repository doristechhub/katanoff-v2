import { Helmet } from 'react-helmet-async';

import { OrderDetailPage } from 'src/sections/order-detail';

// ----------------------------------------------------------------------

export default function OrderDetail() {
  return (
    <>
      <Helmet>
        <title> Order Detail | Katanoff </title>
      </Helmet>

      <OrderDetailPage />
    </>
  );
}
