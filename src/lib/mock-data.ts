import type { BusinessResult, SearchParams } from "@/types/outreach";

const MOCK_SHOPS = [
  {
    shopName: "Luxe Hair Studio",
    phone: "+91 98765 43210",
    address: "14 Linking Road, Bandra West",
  },
  {
    shopName: "Glow & Grace Salon",
    phone: "+91 98201 55678",
    address: "Shop 3, Oberoi Mall, Goregaon East",
  },
  {
    shopName: "The Style Bar",
    phone: "+91 97654 32109",
    address: "22 Hill Road, Bandra West",
  },
  {
    shopName: "Urban Cuts",
    phone: "+91 98190 11223",
    address: "5 Carter Road, Bandra West",
  },
  {
    shopName: "Bliss Beauty Lounge",
    phone: "+91 99301 44556",
    address: "101 Phoenix Marketcity, Kurla",
  },
  {
    shopName: "Shear Elegance",
    phone: "+91 98920 77889",
    address: "8 Juhu Tara Road, Juhu",
  },
];

export function generateMessage(
  template: string,
  shopName: string,
  location: string,
  businessCategory: string
): string {
  const personalized = template
    .replace(/\{shop_name\}/gi, shopName)
    .replace(/\{location\}/gi, location)
    .replace(/\{business_category\}/gi, businessCategory)
    .replace(/\{business_type\}/gi, businessCategory);

  if (personalized !== template) {
    return personalized;
  }

  return `Hi ${shopName}! We're reaching out to ${businessCategory.toLowerCase()} businesses in ${location}. ${template}`;
}

export function buildMockResults(params: SearchParams): BusinessResult[] {
  const count = Math.min(3 + Math.floor(params.radiusKm / 2), MOCK_SHOPS.length);

  return MOCK_SHOPS.slice(0, count).map((shop, index) => ({
    id: `shop-${index + 1}`,
    shopName: shop.shopName,
    phone: shop.phone,
    address: `${shop.address}, ${params.location}`,
    aiMessage: generateMessage(
      params.messageTemplate,
      shop.shopName,
      params.location,
      params.businessCategory
    ),
    actionStatus: "idle" as const,
  }));
}

export const INITIAL_SAMPLE_RESULTS: BusinessResult[] = buildMockResults({
  location: "Mumbai, India",
  radiusKm: 5,
  businessCategory: "Salons",
  messageTemplate:
    "Hello {shop_name}! We noticed your {business_category} in {location} and would love to connect about a partnership opportunity.",
});
