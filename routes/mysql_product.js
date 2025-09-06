// import the service
import {MysqlProductService} from "../services/mysql_product.js";
import moment from "moment";

export class MysqlProductRoutings
{

    constructor(app)
    {
        // CREATE INSTANCE
        this.productService = new MysqlProductService();
        this.registerEndpoints(app);
    }

    registerEndpoints(app)
    {
        console.log('register Mysql Product Endpoints');
        // Insert product
        app.post("/api/product",async (req,res) =>
        {
            try
            {
                const created_at = moment().format("YYYY-MM-DD HH:mm:ss");

                let requestObj = {
                    name: req.body.name,
                    code: req.body.code,
                    category: req.body.category,
                    price: req.body.price,
                    specification: req.body.specification,
                    description: req.body.description,
                    images: req.body.images,
                    created_at: created_at,
                };

                const result = await this.productService.insertProduct(requestObj);
                res.status(201).json(result);
            } catch (error)
            {
                console.error("Error inserting product:",error);
                res.status(400).json({error: error.message});
            }
        });

        // Get all products
        app.get("/api/product",async (req,res) =>
        {
            try
            {
                const result = await this.productService.getAllProducts();
                res.status(201).json(result);
            } catch (error)
            {
                console.error("Error fetching products:",error);
                res.status(400).json({error: error.message});
            }
        });

        // Get product by ID
        app.get("/api/product/:id",async (req,res) =>
        {
            try
            {
                const result = await this.productService.getProductById(req.params.id);
                res.status(201).json(result);
            } catch (error)
            {
                console.error("Error fetching product by ID:",error);
                res.status(400).json({error: error.message});
            }
        });

        // Update product
        app.put("/api/product/:id",async (req,res) =>
        {
            try
            {
                let requestObj = {
                    name: req.body.name,
                    code: req.body.code,
                    category: req.body.category,
                    price: req.body.price,
                    specification: req.body.specification,
                    description: req.body.description,
                    images: req.body.images,
                };

                const result = await this.productService.updateProduct(req.params.id,requestObj);
                res.status(201).json(result);

            } catch (error)
            {
                console.error("Error updating product:",error);
                res.status(400).json({error: error.message});
            }
        });

        // Delete product
        app.delete("/api/product/:id",async (req,res) =>
        {
            try
            {
                const result = await this.productService.deleteProduct(mysqlConnectionPool,req.params.id);
                res.status(201).json(result);
            } catch (error)
            {
                console.error("Error deleting product:",error);
                res.status(400).json({error: error.message});
            }
        });
    }
}
