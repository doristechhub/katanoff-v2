import { Helmet } from 'react-helmet-async';

import ImportFromExcelFirst from 'src/sections/products/import-from-excel-first';

// ----------------------------------------------------------------------

export default function ImportFromExcelPage() {
  return (
    <>
      <Helmet>
        <title> Import Products From Excel - 1 | Sapphire Tree </title>
      </Helmet>

      <ImportFromExcelFirst />
    </>
  );
}
