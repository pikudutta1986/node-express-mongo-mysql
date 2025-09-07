// THIS MIDDLEWIRE NEED TO INJECT IN THE EXPRESS ENDPOINT RULE TO PROTECT A API END POINT.
// EXAMPLE OF ENDPOINT: 
//router.get("/admin", AuthMiddleware, roleMiddleware("ADMIN"), (req, res) => {
    //res.json({ message: "Hello Admin!" });
//});
export function roleMiddleware(...allowedRoles)
{
    return (req,res,next) =>
    {
        // FIRST CHECKING THE USER FORM REQUEST. IF USER NOT FOUND.
        if (!req.user)
        {
            // RETURN WITH NOT AUTHENTICATED MESSAGE.
            return res.status(401).json({message: "Not authenticated"});
        }

        // IF THE USER ROLE IN PRESENT IN THE ALLEOW ROLES. 
        if (!allowedRoles.includes(req.user.role))
        {
            // RETURN WITH NO ACCESS MESSAGE.
            return res.status(403).json({message: "Forbidden: You don't have access"});
        }

        // OTHERWISE PROCESS THE REQUEST.
        next();
    };
}
