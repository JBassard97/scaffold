import jwt from "jsonwebtoken";

export function verifyToken(token: string) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET as string);
    } catch (error) {
        return null;
    }
}

// Function to decode and check token validity
export function isLoggedIn(token: string): boolean {
    try {
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

