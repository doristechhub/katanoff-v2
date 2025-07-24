import { Helmet } from 'react-helmet-async';

import { SettingsView } from 'src/sections/settings';

// ----------------------------------------------------------------------

export default function SettingPage() {
  return (
    <>
      <Helmet>
        <title> Settings | Katanoff </title>
      </Helmet>
      <SettingsView />
    </>
  );
}
