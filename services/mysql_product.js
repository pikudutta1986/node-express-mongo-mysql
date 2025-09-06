// IMPORT MYSQL DB CONNECTION POOL
import {connectToMySql} from "../database/mysqldb.js";

export class MysqlProductService
{
    constructor()
    {
        // MYSQL CONNECTION POOL (returns promise, so await later)
        this.mysqlConnectionPool = connectToMySql();
    }

    // INSERT PRODUCT
    async insertProduct(requestObject)
    {
        try
        {
            const pool = await this.mysqlConnectionPool;
            const sqlString = `INSERT INTO product 
            (name, code, category, price, specification, description, images, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

            const valueArray = [
                requestObject.name,
                requestObject.code,
                requestObject.category,
                requestObject.price,
                requestObject.specification,
                requestObject.description,
                requestObject.images,
                requestObject.created_at,
            ];

            const [result] = await pool.execute(sqlString,valueArray);

            return {
                success: true,
                data: {insertId: result.insertId},
                message: "Product inserted successfully.",
            };
        } catch (error)
        {
            console.error("Error inserting product:",error);
            return {success: false,message: "Failed to insert product.",error};
        }
    }

    // GET PRODUCT BY ID
    async getProductById(productId)
    {
        try
        {
            const pool = await this.mysqlConnectionPool;
            const sqlString = `SELECT * FROM product WHERE id = ?`;
            const [rows] = await pool.execute(sqlString,[productId]);

            if (!rows.length)
            {
                return {success: false,message: "Product not found."};
            }

            return {success: true,data: rows[0],message: "Product fetched successfully."};
        } catch (error)
        {
            console.error("Error fetching product by ID:",error);
            return {success: false,message: "Failed to fetch product.",error};
        }
    }

    // GET ALL PRODUCTS
    async getAllProducts()
    {
        try
        {
            const pool = await this.mysqlConnectionPool;
            const sqlString = `SELECT * FROM product ORDER BY created_at DESC`;
            const [rows] = await pool.execute(sqlString);

            return {success: true,data: rows,message: "Products fetched successfully."};
        } catch (error)
        {
            console.error("Error fetching all products:",error);
            return {success: false,message: "Failed to fetch products.",error};
        }
    }

    // UPDATE PRODUCT
    async updateProduct(productId,updateObject)
    {
        try
        {
            const pool = await this.mysqlConnectionPool;

            // Build dynamic SET query
            const fields = [];
            const values = [];
            for (const [key,value] of Object.entries(updateObject))
            {
                fields.push(`${key} = ?`);
                values.push(value);
            }

            if (!fields.length)
            {
                return {success: false,message: "No fields provided to update."};
            }

            const sqlString = `UPDATE product SET ${fields.join(", ")} WHERE id = ?`;
            values.push(productId);

            const [result] = await pool.execute(sqlString,values);

            if (result.affectedRows === 0)
            {
                return {success: false,message: "No product found to update."};
            }

            return {success: true,data: {affectedRows: result.affectedRows},message: "Product updated successfully."};
        } catch (error)
        {
            console.error("Error updating product:",error);
            return {success: false,message: "Failed to update product.",error};
        }
    }

    // DELETE PRODUCT
    async deleteProduct(productId)
    {
        try
        {
            const pool = await this.mysqlConnectionPool;
            const sqlString = `DELETE FROM product WHERE id = ?`;
            const [result] = await pool.execute(sqlString,[productId]);

            if (result.affectedRows === 0)
            {
                return {success: false,message: "No product found to delete."};
            }

            return {success: true,data: {affectedRows: result.affectedRows},message: "Product deleted successfully."};
        } catch (error)
        {
            console.error("Error deleting product:",error);
            return {success: false,message: "Failed to delete product.",error};
        }
    }

    // SEARCH PRODUCTS (optional, filter by name/category/price range)
    async searchProducts({name,category,minPrice,maxPrice})
    {
        try
        {
            const pool = await this.mysqlConnectionPool;
            let sqlString = `SELECT * FROM product WHERE 1=1`;
            const values = [];

            if (name)
            {
                sqlString += ` AND name LIKE ?`;
                values.push(`%${name}%`);
            }
            if (category)
            {
                sqlString += ` AND category = ?`;
                values.push(category);
            }
            if (minPrice)
            {
                sqlString += ` AND price >= ?`;
                values.push(minPrice);
            }
            if (maxPrice)
            {
                sqlString += ` AND price <= ?`;
                values.push(maxPrice);
            }

            sqlString += ` ORDER BY created_at DESC`;

            const [rows] = await pool.execute(sqlString,values);

            return {success: true,data: rows,message: "Search results fetched successfully."};
        } catch (error)
        {
            console.error("Error searching products:",error);
            return {success: false,message: "Failed to search products.",error};
        }
    }
}
