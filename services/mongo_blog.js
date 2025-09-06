
// import blog schema
import blog from "../mongo_models/blog.js";

export class MongoBlogService
{

    constructor()
    {

    }

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
            return {
                success: false,
                message: error.toString()
            }
        }
    }

    async getBlog(filterObject)
    {
        try
        {
            const result = await blog.find(filterObject);
            if (!result) return {success: false,message: "No blog found."};
            return {
                success: true,
                data: result,
                message: 'Blog data from mongo database.'
            }
        } catch (error)
        {
            return {
                success: false,
                message: error.toString()
            }
        }
    }

    // READ ONE
    async getBlogById(id)
    {
        try
        {
            const result = await blog.findById(id);
            if (!result) return {success: false,message: "Blog not found."};
            return {success: true,data: result,message: "Single blog from mongo database."};
        } catch (error)
        {
            return {success: false,message: error.toString()};
        }
    }

    // UPDATE
    async updateBlog(id,object)
    {
        try
        {
            const result = await blog.findByIdAndUpdate(id,object,{new: true});
            if (!result) return {success: false,message: "Blog not found"};
            return {success: true,data: result,message: "Blog updated"};
        } catch (error)
        {
            return {success: false,message: error.toString()};
        }
    }

    async deleteBlog(id)
    {
        try
        {
            const result = await blog.findByIdAndDelete(id);
            if (!result) return {success: false,message: "Blog not found"};
            return {success: true,data: result,message: "Blog deleted"};
        } catch (error)
        {
            return {success: false,message: error.toString()};
        }
    }

    // DELETE
    async deleteBlog(id)
    {
        try
        {
            const result = await blog.findByIdAndDelete(id);
            if (!result) return {success: false,message: "Blog not found"};
            return {success: true,data: result,message: "Blog deleted"};
        } catch (error)
        {
            return {success: false,message: error.toString()};
        }
    }


    async deleteAll()
    {
        try
        {
            const result = await blog.deleteMany({});
            if (!result) return {success: false,message: "Blog not found"};
            return {success: true,data: result,message: "All Blog deleted"};
        } catch (error)
        {
            return {success: false,message: error.toString()};
        }
    }

}