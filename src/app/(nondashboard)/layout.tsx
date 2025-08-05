import Navbar from "@/app/(nondashboard)/landing/_components/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full w-full">
      <Navbar />
      <main className="h-full w-full">{children}</main>
    </div>
  );
}
