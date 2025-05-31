import { Footer, Header } from "@/components/dynamiComponents";

export default function ShopLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-[17vh] md:h-[12vh] lg:h-auto">
        <Header />
      </div>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
