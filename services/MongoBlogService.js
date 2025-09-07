
// IMPORT MONGO BLOG SCHEMA
import blog from "../mongo_models/blog.js";

// MONGO BLOG SERVICE TO OPERATE CURD OPERATIONS ON MONGO BLOG SCHEMA 
export class MongoBlogService
{
    constructor()
    {

    }

    
    // ================================================
    // FUNCTION TO CREATE A BLOG
    // ================================================
    async insertBlog(object)
    {
        try
        {
            const newBlog = new blog(object);
            const result = await newBlog.save();
            if (!result) return {success: false,message: "Unable to create blog."};
            return {
                success: true,
                data: result,
                message: 'Blog inserted into mongo database.'
            }
        } catch (error)
        {
            // THROW INSERT BLOG FAILED ERROR
            throw new Error("Insert blog failed: " + error.message);
        }
    }

    
    // ================================================
    // FUNCTION TO GET BLOGS BY FILTER
    // ================================================
    async getBlog(filterObject)
    {
        try
        {
            // GET BLOGS BY FILTER FROM MONGO
            const result = await blog.find(filterObject);
            // RETURN THE FUNCTION RESPONSE
            return {
                success: true,
                data: result,
                message: 'Blog data from mongo database.'
            }
        } catch (error)
        {
            // THROW GET BLOGS FAILED ERROR
            throw new Error("Get all blogs failed: " + error.message);
        }
    }

    // ================================================
    // FUNCTION TO GET A BLOG BY ID
    // ================================================
    async getBlogById(id)
    {
        try
        {
            // GET BLOG BY ID FROM MONGO
            const result = await blog.findById(id);
            // IF NOT FOUND
            if (!result) {
                // THROW BLOG NOT FOUND ERROR
                throw new Error("Blog not found");
            }
            // RETURN THE FUNCTION RESPONSE
            return {success: true, data: result, message: "Single blog from mongo database."};
        } catch (error)
        {
            // THROW GET BLOG FAILED ERROR
            throw new Error("Get blog failed: " + error.message);
        }
    }

    // ================================================
    // FUNCTION TO UPDATE A BLOG BY ID
    // ================================================
    async updateBlog(id, object)
    {
        try
        {
            // UPDATE THE BLOG IN MONGO
            const result = await blog.findByIdAndUpdate(id, object, {new: true});
            // IF NOT UPDATED
            if (!result) {
                // THROW BLOG NOT FOUND ERROR
                throw new Error("Blog not found");
            }
            // RETURN THE FUNCTION RESPONSE
            return {success: true, data: result, message: "Blog updated"};
        } catch (error)
        {
            // THROW BLOG UPDATE FAILED ERROR
            throw new Error("Blog update failed: " + error.message);
        }
    }

    // ================================================
    // FUNCTION TO DELETE A BLOG BY ID
    // ================================================
    async deleteBlog(id)
    {
        try
        {
            // DELETE ONE BLOG IN MONGO
            const result = await blog.findByIdAndDelete(id);
            // IF NOT DELETED
            if (!result) {
                // THROW BLOG NOT FOUND ERROR
                throw new Error("Blog not found");
            }

            // RETURN THE FUNCTION RESPONSE
            return {success: true, data: result, message: "Blog deleted"};
        } catch (error)
        {
            // THROW ONE DELETE FAILED ERROR
            throw new Error("Single blog delete failed: " + error.message);
        }
    }
    
    // ================================================
    // FUNCTION TO DELETE ALL BLOG
    // ================================================
    async deleteAll()
    {
        try
        {
            // DELETE ALL BLOG IN MONGO
            const result = await blog.deleteMany({});
            // RETURN THE FUNCTION RESPONSE
            return {success: true, data: result, message: "All Blog deleted"};
        } catch (error)
        {
            // THROW ALL DELETE FAILED ERROR
            throw new Error("All blog delete failed: " + error.message);
        }
    }

}