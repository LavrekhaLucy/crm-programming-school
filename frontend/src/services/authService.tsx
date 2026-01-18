export interface LoginData {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}

export const loginRequest = async (
  data: LoginData
): Promise<LoginResponse> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (data.email === "test@test.com" && data.password === "123456") {
                resolve({ token: "fake-jwt-token" });
            } else {
                reject(new Error("Невірний email або пароль"));
            }
        }, 1000);
    });
};

