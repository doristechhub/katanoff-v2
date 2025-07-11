import { Helmet } from 'react-helmet-async';

import { Contacts } from 'src/sections/contacts';

// ----------------------------------------------------------------------

export default function ContactsPage() {
  return (
    <>
      <Helmet>
        <title> Contacts | Katanoff </title>
      </Helmet>

      <Contacts />
    </>
  );
}
