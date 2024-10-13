import { SocketProvider } from "@/lib/SocketProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SocketProvider>{children}</SocketProvider>;
}
