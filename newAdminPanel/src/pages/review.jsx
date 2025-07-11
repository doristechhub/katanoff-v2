import { Helmet } from 'react-helmet-async';

import { Review } from 'src/sections/review';

// ----------------------------------------------------------------------

export default function ReviewsPage() {
  return (
    <>
      <Helmet>
        <title> Reviews | Katanoff </title>
      </Helmet>

      <Review />
    </>
  );
}
