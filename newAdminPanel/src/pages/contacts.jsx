import { Helmet } from 'react-helmet-async';

import { Contacts } from 'src/sections/contacts';

// ----------------------------------------------------------------------

export default function ContactsPage() {
  return (
    <>
      <Helmet>
        <title> Contacts | Katan Off </title>
      </Helmet>

      <Contacts />
    </>
  );
}
