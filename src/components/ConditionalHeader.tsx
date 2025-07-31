"use client";
import { usePathname } from "next/navigation";
import Header from "./Header";

const ConditionalHeader = () => {
  const pathname = usePathname();
  
  // Hide header on home page (root path)
  if (pathname === "/") {
    return null;
  }
  
  return <Header />;
};

export default ConditionalHeader;
