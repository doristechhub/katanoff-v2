import { Helmet } from 'react-helmet-async';

import { ForgetPassword } from 'src/sections/forgetPassword';

// ----------------------------------------------------------------------

export default function ForgetPasswordPage() {
  return (
    <>
      <Helmet>
        <title>Forget Password | Katanoff </title>
      </Helmet>

      <ForgetPassword />
    </>
  );
}
