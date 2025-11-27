export async function api<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(path, {
        ...init,
        headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed: ${res.status}`);
    }
    return res.json() as Promise<T>;
}

export const toNumber = (v: string | number) => (typeof v === "string" ? parseFloat(v) : v);

export const cls = {
    h1: "text-xl font-semibold",
    card: "bg-white shadow rounded",
    th: "p-3 text-left bg-gray-50",
    td: "p-3",
    btn: "px-4 py-2 rounded disabled:opacity-60 disabled:cursor-not-allowed",
    btnPrimary: "bg-blue-600 text-white hover:bg-blue-700",
    btnDanger: "bg-red-600 text-white hover:bg-red-700",
    btnGhost: "bg-gray-200 hover:bg-gray-300",
    input: "border rounded p-2",
};