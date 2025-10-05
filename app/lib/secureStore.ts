import * as SecureStore from "expo-secure-store";

export async function saveToken(token: string) {
    if (!token) return;
    await SecureStore.setItemAsync("token", token);
}

export async function getToken() {
    return await SecureStore.getItemAsync("token");
}

export async function clearToken() {
    await SecureStore.deleteItemAsync("token");
}

export async function saveUser(user: any | null) {
    if (!user) {
        await SecureStore.deleteItemAsync("user");
        return;
    }
    await SecureStore.setItemAsync("user", JSON.stringify(user));
}

export async function getUser() {
    const raw = await SecureStore.getItemAsync("user");
    return raw ? JSON.parse(raw) : null;
}
