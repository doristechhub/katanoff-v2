import { Helmet } from 'react-helmet-async';

import { SettingStyle } from 'src/sections/settingStyle';

// ----------------------------------------------------------------------

export default function SettingStylePage() {
  return (
    <>
      <Helmet>
        <title> Setting style | Katanoff </title>
      </Helmet>

      <SettingStyle />
    </>
  );
}
