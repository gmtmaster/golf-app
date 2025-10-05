import {
    getToken,
    saveToken,
    clearToken,
    saveUser,
    getUser,
} from "./secureStore";

const API_BASE = "https://trackman-cloud.vercel.app/api/mobile";

/**
 * Login
 * - hívja a backend login endpointot
 * - elmenti a JWT tokent és a user adatokat (név + email)
 */
export async function login(email: string, password: string) {
    try {
        const res = await fetch(`${API_BASE}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        console.log("LOGIN RESPONSE:", data);

        if (data.token) {
            await saveToken(data.token);
            if (data.user) await saveUser(data.user); // ✅ tárold a usert is
        }

        return data;
    } catch (err) {
        console.error("Login error:", err);
        return { error: "Network error" };
    }
}

/**
 * Register
 * - új user létrehozása
 */
export async function register(name: string, email: string, password: string) {
    const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (data.token) {
        await saveToken(data.token);
        if (data.user) await saveUser(data.user);
    }
    return data;
}

/**
 * Logout
 * - törli a tokent és a usert
 */
export async function logout() {
    await clearToken();
    await saveUser(null);
}

/**
 * Get stored user (offline vagy cache-ből)
 * - a SecureStore-ból olvassa vissza
 */
export async function getCurrentUser() {
    const user = await getUser();
    console.log("🧑‍💻 CURRENT USER:", user);
    return user;
}

/**
 * Új ütés mentése a backendre
 */
export async function saveShot(shotData: {

    club: string;
    carry?: number;
    total?: number;
    ballSpeed?: number;
    clubSpeed?: number;
    smash?: number;
    launchDeg?: number;
    spin?: number;
    offlineM?: number;
    result?: string;
}) {
    const token = await getToken();
    if (!token) {
        console.warn("❌ Nincs token, a user nincs bejelentkezve");
        return { error: "Unauthorized" };
    }

    try {
        const res = await fetch(`${API_BASE}/shots`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(shotData),
        });

        const data = await res.json();
        if (!res.ok) {
            console.error("❌ saveShot error:", data);
            return { error: data.error || "Save failed" };
        }

        console.log("✅ Shot saved:", data);
        return data;
    } catch (err) {
        console.error("💥 Network error in saveShot:", err);
        return { error: "Network error" };
    }
}


/**
 * Példa védett API-hívás tokennel
 */
export async function savePressureGame(
    score: number,
    rounds: number,
    details: any[]
) {
    const token = await getToken();
    const res = await fetch(`${API_BASE}/save-pressure`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ score, rounds, details }),
    });
    return res.json();
}
