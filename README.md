## This is a simple api framework done with node express js with both mysql and mongo db connection.
We can use this with any front end framework. This is a well structure express framework with scalability.

# How to setup
1. Clone the repo.
2. Create a mysql databse and import the mysql-database.sql.
3. Open .env and add your mongo connection url and mysql host, username, password and database name.
4. Now inside the project directory do "npm install" to install all the dependencies.
5. Then start the node server with "npm start"
6. All api enpoints are ready to work.

## Modules covered
Authentication, Products, Orders, Blog

## Workflows
1. Authentication: User data will be stored in mysql database. User registration and User Login apis are implemented. Password encrypted during registration and stored in database. On login JWT authentication token created to validate the restricted product and order apis.

2. Products: Product data will be stored in mysql database. Product creation, update and delete are validated with authentication token for security purpose. Getting products is public. 

3. Orders: Orders are stored in mongo database. All the api endpoints are restricted with authentication token.

4. Blog: This is another mongo entry with public access.

