import { Footer, ProfileHeader } from "@/components/dynamiComponents";

export default function AccountLayout({ children }) {
  return (
    <main>
      <ProfileHeader />
      {children}
      <Footer />
    </main>
  );
}
