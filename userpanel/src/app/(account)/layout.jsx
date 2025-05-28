import { Footer, ProfileHeader } from "@/components/dynamiComponents";

export default function AccountLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <ProfileHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
