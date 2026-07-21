import type { Metadata } from "next";
import OrderClient from "./OrderClient";

export const metadata: Metadata = {
  title: "Order",
  description:
    "Bargain the final rate on WhatsApp, then place your Meridian cargo order and track it live.",
};

export default function OrderPage() {
  return <OrderClient />;
}
