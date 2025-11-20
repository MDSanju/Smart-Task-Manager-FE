import api from "./api";

type RegisterBody = { name: string; email: string; password: string };
type LoginBody = { email: string; password: string };

export const registerApi = (body: RegisterBody) => {
  return api.post("/api/auth/register", body);
};

export const loginApi = (body: LoginBody) => {
  return api.post("/api/auth/login", body);
};

export const logoutApi = (token?: string) => {
  return api.post(
    "/api/auth/logout",
    {},
    {
      headers: {
        "x-auth-token":
          token ??
          (typeof window !== "undefined"
            ? localStorage.getItem("token") || ""
            : ""),
      },
    }
  );
};
