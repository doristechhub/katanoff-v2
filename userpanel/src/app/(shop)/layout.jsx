import { Footer, Header } from "@/components/dynamiComponents";

export default function ShopLayout({ children }) {
  return (
    <div>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
