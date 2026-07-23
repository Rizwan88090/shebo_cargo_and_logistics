import { redirect } from "next/navigation";

// The quote flow is unified with the clean Order page: customers just enter
// their shipment details (no rate/amount) and our team follows up. Any
// "Request a Quote" / "Get a Quote" link lands on that single clean flow.
export default function RequestQuotePage() {
  redirect("/order");
}
