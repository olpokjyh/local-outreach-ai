export type ActionStatus = "idle" | "sending" | "sent" | "failed";

export type BusinessResult = {
  id: string;
  shopName: string;
  phone: string;
  address: string;
  aiMessage: string;
  actionStatus: ActionStatus;
};

export type SearchParams = {
  location: string;
  radiusKm: number;
  businessCategory: string;
  messageTemplate: string;
};

export type SearchShopsRequest = SearchParams;

export type SearchShopsResponse = {
  results: BusinessResult[];
  meta: {
    location: string;
    businessCategory: string;
    radiusKm: number;
    count: number;
  };
};

export type SendMessagesRequest = {
  messages: Array<{
    id: string;
    shopName: string;
    phone: string;
    message: string;
  }>;
};

export type SendMessagesResponse = {
  sent: string[];
  failed: string[];
};
