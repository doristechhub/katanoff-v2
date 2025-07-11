import { Helmet } from 'react-helmet-async';

import { AddDiscount } from 'src/sections/discounts/add';

// ----------------------------------------------------------------------

export default function AddDiscountPage() {
  return (
    <>
      <Helmet>
        <title> Discounts | Katanoff </title>
      </Helmet>

      <AddDiscount />
    </>
  );
}
