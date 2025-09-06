
// import the routings
import {MongoBlogService} from "../services/mongo_blog.js";

export class MongoBlogRoutings
{
    constructor(app)
    {
        // CREATE INSTANCE
        this.blogService = new MongoBlogService(); 
        // REGISTER ALL THE BLOG END POINTS
        this.registerEndpoints(app);
    }

    registerEndpoints(app)
    {
        console.log('register Mongo Blog Endpoints');
        
        // INSERT A BLOG
        app.post('/api/blog', async (req,res) =>
        {
            try
            {
                const result = await this.blogService.insertBlog(req.body);
                res.status(201).json(result);
            } catch (error)
            {
                res.status(500).json({error: error.message});
            }
        });

        // GET BLOGS BY FILTER
        app.get('/api/blog', async (req,res) =>
        {
            try
            {
                const { category } = req.params;
                const filterObject = {};
                if (category) {
                    filterObject.category = category;
                }
                const result = await this.blogService.getBlog(filterObject);
                res.status(201).json(result);
            } catch (error)
            {
                res.status(500).json({error: error.message});
            }
        });

        // GET BLOG BY ID
        app.get('/api/blog/:id', async (req,res) =>
        {
            try
            {
                // GET id from URL
                const blogId = req.params.id; 
                // MongoDB USES `_id`               
                const filterObject = {_id: blogId};        

                const result = await this.blogService.getBlog(filterObject);
                if (!result || result.success === false)
                {
                    return res.status(404).json({error: "Blog not found"});
                }

                res.status(200).json(result);
            } catch (error)
            {
                res.status(500).json({error: error.message});
            }
        });

        // UPDATE BLOG
        app.put('/api/blog/:id', async (req,res) =>
        {
            try
            {
                const result = await this.blogService.updateBlog(req.params.id, req.body);
                res.status(201).json(result);
            } catch (error)
            {
                res.status(500).json({error: error.message});
            }
        });

        // DELETE BLOG
        app.delete('/api/blog', async (req,res) =>
        {
            try
            {
                const result = await this.blogService.deleteAll();
                res.status(201).json(result);
            } catch (error)
            {
                res.status(500).json({error: error.message});
            }
        });

        app.delete('/api/blog/:id', async (req,res) =>
        {
            try
            {
                const result = await this.blogService.deleteBlog(req.params.id);
                res.status(201).json(result);
            } catch (error)
            {
                res.status(500).json({error: error.message});
            }
        });
    }
}
