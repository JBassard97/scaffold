import jwt from "jsonwebtoken";

export function verifyToken(token: string) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET as string);
    } catch (error) {
        return null;
    }
}

// ! Opting out of expiring tokens for now
// export function isLoggedIn(token: string): boolean {
//     try {
//         if (!token || token.split(".").length !== 3) {
//             console.error("Invalid token format");
//             return false;
//         }

//         const base64Url = token.split(".")[1];
//         const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // Ensure proper Base64 format
//         const decoded = JSON.parse(atob(base64)); // Decode JWT payload safely
//         const exp = decoded?.exp; // Get expiration time from payload

//         if (!exp || Date.now() >= exp * 1000) {
//             console.error("Token expired");
//             return false;
//         }

//         return true;
//     } catch (err) {
//         console.error("Invalid token", err);
//         return false;
//     }
// }


