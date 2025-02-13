"use client";

export function isLoggedIn(): boolean {
    // Get the token from localStorage
    const token = localStorage.getItem("token");

    if (!token) {
        return false;
    }

    try {
        // Try decoding the token to see if it's valid
        const decoded = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
        const exp = decoded?.exp; // Get expiration time from the payload

        // If token expired or there's no expiration, return false
        if (!exp || Date.now() >= exp * 1000) {
            return false;
        }

        return true;
    } catch (err) {
        console.error("Invalid token", err);
        return false;
    }
}