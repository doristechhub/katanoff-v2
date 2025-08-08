const { INVOICE_CONFIG } = require("../helpers/common");

const header = ({ logoUrl, formattedDate, title = "Invoice" }) => {
  const logoSrc = logoUrl || "";
  return `
    <header class="p-4 w-full">
      <div class="items-start w-full">
        <div class="flex items-center justify-center align-middle">
          <img src="${logoSrc}" alt="Logo" class="w-32 object-contain" />
        </div>
        <div class="text-right text-xs text-black pl-[5%]"> 
          <h1 class="text-2xl">${title}</h1>
          <p>${formattedDate}</p>
        </div>
      </div>
    </header>
  `;
};

const footer = () => {
  return `
    <footer class="text-gray-600 rounded-lg text-xs w-full bottom-5 absolute">
      <div class="text-center">
        <p>&copy; ${new Date().getFullYear()} ${
    INVOICE_CONFIG.COMPANY_NAME
  }. All Rights Reserved.</p>
      </div>
    </footer>
  `;
};

const generateHTML = ({ logoUrl, formattedDate, title, bodyContent }) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title}</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-white text-sm font-sans leading-6 w-full px-6">
      ${header({ logoUrl, formattedDate, title })}
      ${bodyContent}
      ${footer()}
    </body>
    </html>
  `;
};

module.exports = {
  header,
  footer,
  generateHTML,
};
