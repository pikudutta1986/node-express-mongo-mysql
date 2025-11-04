// import mongoose
import mongoose from "mongoose";

// CREATING DOCUMENT STRUCTURE
const blogSchema = new mongoose.Schema(
    {
        title: {type: String, required: true},
        image_url: {type: String, required: true},
        tags: {type: [String], required: true},
        category: {type: String, required: true},
        content: {type: String, required: true}
    },
    { timestamps: true } // auto adds createdAt, updatedAt
);

// CREATE THE BLOG COLLECTION
const Blog = mongoose.model("blog", blogSchema);

// EXPORT THE BLOG COLLECTION FOR CURD OPERATION
export default Blog;