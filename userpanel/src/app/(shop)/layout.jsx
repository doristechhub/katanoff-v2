import { Footer, Header } from "@/components/dynamiComponents";

export default function ShopLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-[20vh] md:h-[13vh] lg:h-auto">
        <Header />
      </div>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
