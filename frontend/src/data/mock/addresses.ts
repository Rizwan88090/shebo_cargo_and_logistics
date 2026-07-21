export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
}

export const mockAddresses: Address[] = [
  {
    id: "addr-1",
    label: "Office",
    fullName: "Ahmed Al Maktoum",
    phone: "+971 50 123 4567",
    addressLine1: "Tower 3, Floor 12, Office 1205",
    addressLine2: "Business Bay",
    city: "Dubai",
    country: "United Arab Emirates",
    postalCode: "00000",
    isDefault: true,
  },
  {
    id: "addr-2",
    label: "Home",
    fullName: "Ahmed Al Maktoum",
    phone: "+971 50 123 4567",
    addressLine1: "Villa 42, Street 8",
    addressLine2: "Jumeirah Village Circle",
    city: "Dubai",
    country: "United Arab Emirates",
    postalCode: "00000",
    isDefault: false,
  },
  {
    id: "addr-3",
    label: "Warehouse",
    fullName: "Al Maktoum Trading LLC",
    phone: "+971 4 555 9999",
    addressLine1: "Plot 15, Jebel Ali Free Zone",
    city: "Dubai",
    country: "United Arab Emirates",
    postalCode: "00000",
    isDefault: false,
  },
  {
    id: "addr-4",
    label: "Branch Office",
    fullName: "Ahmed Al Maktoum",
    phone: "+966 50 987 6543",
    addressLine1: "King Fahd Road, Building 22",
    addressLine2: "Al Olaya District",
    city: "Riyadh",
    country: "Saudi Arabia",
    postalCode: "11564",
    isDefault: false,
  },
];
