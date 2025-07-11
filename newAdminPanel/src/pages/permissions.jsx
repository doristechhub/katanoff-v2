import { Helmet } from 'react-helmet-async';

import { PermissionsPage } from 'src/sections/permissions';

// ----------------------------------------------------------------------

export default function Permissions() {
  return (
    <>
      <Helmet>
        <title> Permissions | Katanoff </title>
      </Helmet>

      <PermissionsPage />
    </>
  );
}
