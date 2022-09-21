import { BaseService } from "./baseService";
import { API_BITLY_TOKEN, API_BITLY_BASE_URL } from "../constants/global";

interface IShortenResponse {
  references: any;
  link: string;
  id: string;
  long_url: string;
  archived: boolean;
  created_at: string;
  custom_bitlinks: string[];
  tags: string[];
  deeplinks: {
    guid: string;
    bitlink: string;
    app_uri_path: string;
    install_url: string;
    app_guid: string;
    os: string;
    install_type: string;
    created: string;
    modified: string;
    brand_guid: string;
  }[];
}

export class BitlyService extends BaseService {
  shorten(url: string, domain: string = "bit.ly"): Promise<IShortenResponse> {
    return this.fetchJSON(`/shorten`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_BITLY_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ long_url: url, domain })
    });
  }
}

export const bitlyService = new BitlyService(API_BITLY_BASE_URL);
