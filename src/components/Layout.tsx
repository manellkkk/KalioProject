import { type ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../index.css";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
