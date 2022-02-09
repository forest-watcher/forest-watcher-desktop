export class BaseService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  fetch = async (url, config) => {
    const headers = config?.headers || {};

    return await fetch(`${this.baseUrl}${url}`, {
      ...config,
      headers: {
        ...headers,
        Authorization: `Bearer ${this.token}`
      }
    });
  };

  fetchJSON = async (url, config) => {
    const response = await this.fetch(url, config);

    if (!response.ok) throw Error(await response.text());
    return response.json();
  };

  fetchBlob = async (url, config) => {
    const response = await this.fetch(url, config);

    if (!response.ok) throw Error(await response.text());
    return response.blob();
  };
}
