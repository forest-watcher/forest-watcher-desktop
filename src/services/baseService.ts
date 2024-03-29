export class BaseService {
  _token = "";
  baseUrl = "";
  _response: null | Response = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  fetch = async (url: string, config?: RequestInit | undefined) => {
    const headers = config?.headers || {};

    return fetch(`${this.baseUrl}${url}`, {
      ...config,
      headers: {
        Authorization: `Bearer ${this.token}`,
        ...headers
      }
    });
  };

  fetchJSON = async (url: string, config?: RequestInit | undefined) => {
    const response = await this.fetch(url, config);

    this._response = response;

    if (!response.ok) {
      throw Error(await response.text());
    }
    return response.json();
  };

  fetchBlob = async (url: string, config?: RequestInit | undefined) => {
    const response = await this.fetch(url, config);

    this._response = response;

    if (!response.ok) throw Error(await response.text());
    return response.blob();
  };

  get token() {
    return this._token;
  }

  set token(value) {
    this._token = value;
  }

  get lastResponse() {
    return this._response;
  }
}
