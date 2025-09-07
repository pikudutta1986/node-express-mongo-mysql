// IMPORT THE ROUTINGS
import { MongoBlogService } from "../services/MongoBlogService.js";

// IMPORT AUTHENTICATION MIDDLEWARE TO VERIFY JWT TOKEN
import { AuthMiddleware } from "../middleware/AuthMiddleware.js";

// IMPORT ROLE-BASED MIDDLEWARE TO RESTRICT ACCESS BY USER ROLE
import { RoleMiddleware } from "../middleware/RoleMiddleware.js";

export class MongoBlogRoutes {
    constructor(app) {
        // CREATE INSTANCE OF BLOG SERVICE
        this.blogService = new MongoBlogService(); 
        // REGISTER ALL THE BLOG ENDPOINTS
        this.registerEndpoints(app);
    }

    registerEndpoints(app) {
        console.log('REGISTER MONGO BLOG ENDPOINTS');
        
        // ================================================
        // CREATE (INSERT) BLOG - ONLY ADMIN ALLOWED
        // ================================================
        app.post('/api/blog', AuthMiddleware, RoleMiddleware("ADMIN"), async (req, res) => {
            try {
                // CALL SERVICE TO INSERT BLOG
                const result = await this.blogService.insertBlog(req.body);
                res.status(201).json(result);
            } catch (error) {
                // SEND ERROR RESPONSE
                res.status(400).json({ message: error.message });
            }
        });

        // ================================================
        // GET ALL BLOG - PUBLIC ACCESS
        // ================================================
        app.get('/api/blog', async (req, res) => {
            try {
                // EXTRACT CATEGORY FROM PARAMS (NOTE: SHOULD USE QUERY INSTEAD)
                const { category } = req.params;
                const filterObject = {};
                if (category) {
                    filterObject.category = category;
                }
                // CALL SERVICE TO GET BLOGS BASED ON FILTER
                const result = await this.blogService.getBlog(filterObject);
                res.status(201).json(result);
            } catch (error) {
                // SEND ERROR RESPONSE
                res.status(400).json({ message: error.message });
            }
        });

        // ================================================
        // GET BLOG BY ID - PUBLIC ACCESS
        // ================================================
        app.get('/api/blog/:id', async (req, res) => {
            try {
                // GET ID FROM URL PARAMS
                const blogId = req.params.id; 
                // MONGODB USES `_id`
                const filterObject = { _id: blogId };        

                // CALL SERVICE TO GET BLOG BY ID
                const result = await this.blogService.getBlog(filterObject);
                if (!result || result.success === false) {
                    // RETURN 404 IF BLOG NOT FOUND
                    return res.status(404).json({ error: "BLOG NOT FOUND" });
                }

                res.status(200).json(result);
            } catch (error) {
                // SEND ERROR RESPONSE
                res.status(400).json({ message: error.message });
            }
        });

        // ================================================
        // UPDATE BLOG - ONLY ADMIN ALLOWED
        // ================================================
        app.put('/api/blog/:id', AuthMiddleware, RoleMiddleware("ADMIN"), async (req, res) => {
            try {
                // CALL SERVICE TO UPDATE BLOG WITH GIVEN ID
                const result = await this.blogService.updateBlog(req.params.id, req.body);
                res.status(201).json(result);
            } catch (error) {
                // SEND ERROR RESPONSE
                res.status(400).json({ message: error.message });
            }
        });

        // ================================================
        // DELETE ALL BLOG - ONLY ADMIN ALLOWED
        // ================================================
        app.delete('/api/blog', AuthMiddleware, RoleMiddleware("ADMIN"), async (req, res) => {
            try {
                // CALL SERVICE TO DELETE ALL BLOGS
                const result = await this.blogService.deleteAll();
                res.status(201).json(result);
            } catch (error) {
                // SEND ERROR RESPONSE
                res.status(400).json({ message: error.message });
            }
        });

        // ================================================
        // DELETE BLOG - ONLY ADMIN ALLOWED
        // ================================================
        app.delete('/api/blog/:id', AuthMiddleware, RoleMiddleware("ADMIN"), async (req, res) => {
            try {
                // CALL SERVICE TO DELETE SINGLE BLOG
                const result = await this.blogService.deleteBlog(req.params.id);
                res.status(201).json(result);
            } catch (error) {
                // SEND ERROR RESPONSE
                res.status(400).json({ message: error.message });
            }
        });
    }
}
