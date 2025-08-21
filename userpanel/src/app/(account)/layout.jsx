import { Footer, ProfileHeader } from "@/components/dynamiComponents";

export default function AccountLayout({ children }) {
  return (
    <>
      <ProfileHeader />
      <main>{children}</main>
      <Footer />
    </>
  );
}
