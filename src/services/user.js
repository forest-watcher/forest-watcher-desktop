import { API_BASE_URL } from "../constants/global";
import { BaseService } from "./baseService";

export class UserService extends BaseService {
  checkLogged(token) {
    this.token = token;
    return this.fetchJSON(`/auth/check-logged`);
  }

  getUser() {
    return this.fetchJSON("/user");
  }

  logout(token) {
    this.token = token;
    return this.fetchJSON("/auth/logout");
  }
}

export const userService = new UserService(API_BASE_URL);
