// IMPORT MYSQL DB CONNECTION POOL
import {connectToMySql} from "../database/mysqldb.js";

// MYSQL PRODUCT SERVICE TO OPERATE CURD OPERATIONS ON PRODUCT TABLE
export class MysqlProductService
{
    constructor()
    {
        // MYSQL CONNECTION POOL
        this.mysqlConnectionPool = connectToMySql();
    }

    // ================================================
    // FUNCTION TO CREATE PRODUCT
    // ================================================
    async insertProduct(requestObject)
    {
        try
        {
            const pool = await this.mysqlConnectionPool;
            // QUERY TO MYSQL TABLE TO GET THE PRODUCT INFORMATION
            const sqlString = `INSERT INTO product 
            (name, code, category, price, specification, description, images, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

            // VALUE ARRAY TO IN QUERY
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

            // EXECUTE THE QUERY
            const [result] = await pool.execute(sqlString,valueArray);

            // RETURN THE FUNCTION RESPONSE
            return {
                success: true,
                data: result,
                message: "Product inserted successfully.",
            };
        } catch (error)
        {
            console.error("Error inserting product:",error);
            // THROW CREATE PRODUCT FAILED ERROR
            throw new Error("Error inserting product:" + error.message);
        }
    }

    // ================================================
    // FUNCTION TO GET ALL PRODUCTS BY FILTER
    // ================================================
    async getAllProducts(filterOptions)
    {
        try
        {
            // GET THE MYSQL CONNETION POOL
            const pool = await this.mysqlConnectionPool;
            
            // SQL QUERY STRING
            let sqlString = `SELECT * FROM product WHERE 1=1`;

            // IF SEARCHING BY NAME
            if (filterOptions?.name && filterOptions?.name != '') {
                // ADD TO QUERY STRING
                sqlString += ` AND name LIKE ?`;
                values.push(`%${name}%`);
            }

            // IF SEARCHING BY CATEGORY
            if (filterOptions?.category && filterOptions?.category != '') {
                // ADD TO QUERY STRING
                sqlString += ` AND category = ?`;
                values.push(category); 
            }
            
            // APPLY SORTING
            sqlString += `ORDER BY created_at DESC`;

            // EXECUTE THE QUERY
            const [result] = await pool.execute(sqlString);

            // RETURN THE FUNCTION RESPONSE
            return {
                success: true,
                data: result,
                message: "Products fetched successfully."
            };
        } catch (error)
        {
            console.error("Error fetching products:",error);
            // THROW GET PRODUCTS FAILED ERROR
            throw new Error("Failed to fetch products: " + error.message);
        }
    }

    // ================================================
    // FUNCTION TO GET PRODUCT BY ID
    // ================================================
    async getProductById(productId)
    {
        try
        {
            // GET THE MYSQL CONNETION POOL
            const pool = await this.mysqlConnectionPool;

            // SQL QUERY TO GET PRODUCT BY ID
            const sqlString = `SELECT * FROM product WHERE id = ?`;
            const [rows] = await pool.execute(sqlString,[productId]);

            if (!rows.length)
            {
                throw new Error("Not a valid id");
            }

            // RETURN THE FUNCTION RESPONSE
            return {
                success: true,
                data: rows[0],
                message: "Product fetched successfully."
            };
        } catch (error)
        {
            console.error("Error fetching product by ID:",error);
            // THROW GET PRODUCT BY ID FAILED ERROR
            throw new Error("Get product by id failed:" + error.message);
        }
    }

    // ================================================
    // FUNCTION TO UPDATE ORDER BY ID
    // ================================================
    async updateProduct(productId, updateObject)
    {
        try
        {
            // GET THE MYSQL CONNETION POOL
            const pool = await this.mysqlConnectionPool;

            // Build dynamic SET query
            const fields = [];
            const values = [];
            for (const [key,value] of Object.entries(updateObject))
            {
                fields.push(`${key} = ?`);
                values.push(value);
            }

            // IF FILEDS NOT FOUND
            if (!fields.length)
            {
                // THROW NO FILEDS TO UPDATE ERROR
                throw new Error("No fileds provided to update");
            }

            // SQL QUERY TO UPDATE PRODUCT
            const sqlString = `UPDATE product SET ${fields.join(", ")} WHERE id = ?`;
            // PUSH PRODUCT ID TO VALUE ARRAY
            values.push(productId);
            // EXCUTE THE MYSQL QUERY
            const [result] = await pool.execute(sqlString,values);

            // IF NO ROWS EFFECTED BY THE QUERY
            if (result.affectedRows === 0)
            {
                // THROW NO PRODUCT TO UPDATE ERROR
                throw new Error("No product found to update.");
            }

            // RETURN THE FUNCTION RESPONSE
            return {
                success: true,
                data: result,
                message: "Product updated successfully."
            };
        } catch (error)
        {
            console.error("Error updating product:",error);
            // THROW UPDATE ERROR
            throw new Error("Error updating product:" + error.message);
        }
    }

    // ================================================
    // FUNCTION TO DELETE PRODUCT BY ID
    // ================================================
    async deleteProduct(productId)
    {
        try
        {
            // GET THE MYSQL CONNETION POOL
            const pool = await this.mysqlConnectionPool;
            // SQL QUERY TO DELETE PRODUCT
            const sqlString = `DELETE FROM product WHERE id = ?`;
            // EXCUTE THE MYSQL QUERY
            const [result] = await pool.execute(sqlString,[productId]);

            // IF NO ROWS EFFECTED BY THE QUERY
            if (result.affectedRows === 0)
            {
                // THROW NO PRODUCT TO DELETE ERROR
                throw new Error("No product found to delete.");
            }
            // RETURN THE FUNCTION RESPONSE
            return {
                success: true,
                message: "Product deleted successfully."
            };
        } catch (error)
        {
            console.error("Error deleting product:",error);
            // THROW DELETE ERROR
            throw new Error("Error deleting product:" + error.message);
        }
    }
}
