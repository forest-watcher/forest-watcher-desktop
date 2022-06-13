import { API_BASE_AUTH_URL } from "../constants/global";
import { BaseService } from "./baseService";

export type TLoginBody = {
  email: string;
  password: string;
};
export type TLoginResponse = {
  data: {
    id: string;
    email: string;
    token: string;
  };
};

export class UserService extends BaseService {
  checkLogged(token: string) {
    this.token = token;
    return this.fetchJSON(`/auth/check-logged`);
  }

  getUser() {
    return this.fetchJSON("/user");
  }

  login(body: TLoginBody): Promise<TLoginResponse> {
    return this.fetchJSON("/auth/login", {
      headers: {
        "Content-Type": "application/json",
        Authorization: ""
      },
      method: "POST",
      body: JSON.stringify(body)
    });
  }

  logout(token: string) {
    this.token = token;
    return this.fetchJSON("/auth/logout");
  }
}

export const userService = new UserService(`${API_BASE_AUTH_URL}`);
