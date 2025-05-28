import { Helmet } from 'react-helmet-async';

import { PermissionsPage } from 'src/sections/permissions';

// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title> Permissions | Katan Off </title>
      </Helmet>

      <PermissionsPage />
    </>
  );
}
