// IMPORT jsonwebtoken TO DECODE AUTH TOKEN
import jwt from "jsonwebtoken";

// THIS MIDDLEWIRE NEED TO INJECT IN THE EXPRESS ENDPOINT RULE TO PROTECT A API END POINT.
// EXAMPLE OF ENDPOINT: 
// router.get("/profile", AuthMiddleware, (req, res) => {
//    res.json({ message: "This is protected" });
//});
// AUTH MIDDLEWARE TO PROTECT API ROUTES
export function AuthMiddleware(req, res, next) {
    // GET AUTHORIZATION HEADER FROM REQUEST (FORMAT SHOULD BE: "BEARER <TOKEN>")
    const authHeader = req.headers["authorization"];

    // EXTRACT THE TOKEN PART (SECOND ELEMENT AFTER "BEARER")
    const token = authHeader && authHeader.split(" ")[1];

    // IF NO TOKEN IS PROVIDED, RETURN 401 UNAUTHORIZED
    if (!token) {
        return res.status(401).json({ message: "ACCESS TOKEN REQUIRED" });
    }

    try {
        // VERIFY AND DECODE THE TOKEN USING THE SERVER'S JWT SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ATTACH THE DECODED USER INFORMATION TO REQUEST OBJECT
        // NOW YOU CAN ACCESS req.user IN ANY ROUTE HANDLER
        req.user = decoded;

        // CALL NEXT() TO PASS CONTROL TO THE NEXT MIDDLEWARE OR ROUTE HANDLER
        next();
    } catch (err) {
        // IF TOKEN VERIFICATION FAILS OR EXPIRES, RETURN 403 FORBIDDEN
        return res.status(403).json({ message: "INVALID OR EXPIRED TOKEN" });
    }
}
