import { HeaderLinkButton } from "@/components/dynamiComponents";

export default function SiteMapPage() {
  const staticLinks = [
    {
      title: "About Us",
      href: "/about-us",
    },
    {
      title: "Education",
      href: "/education",
    },
  ];
  return (
    <div className="flex flex-col">
      {staticLinks?.map((link) => (
        <HeaderLinkButton
          key={`static-link-${link.title}`}
          href={link.href}
          className={`rounded-none hover:!font-semibold flex items-center gap-1 hover:!text-primary`}
        >
          {link.title}
        </HeaderLinkButton>
      ))}
    </div>
  );
}
