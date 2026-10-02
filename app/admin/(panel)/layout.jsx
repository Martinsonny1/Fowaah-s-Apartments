import { requireAdmin } from "@/lib/auth";

export const metadata = { title: "Admin | Fowaah's Apartments", robots: { index: false, follow: false } };

export default async function PanelLayout({ children }) {
  await requireAdmin();
  return children;
}
