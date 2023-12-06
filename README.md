# This repository contains a Node.js application built with the Express framework for managing and serving data related to a menu of items. The application supports basic CRUD (Create, Read, Update, Delete) operations for menu items, including image uploads and customization options.

## Table of Contents
Installation
Usage
Endpoints
File Structure
Dependencies

### Installation
Clone the repository to your local machine:

`git clone https://github.com/your-username/your-repository.git`
Navigate to the project directory:

cd your-repository
Install the dependencies:
`npm install`

### Usage
To start the application, run the following command:
`node src/app.js`

The application will be accessible at `http://localhost:3001` by default.

### Endpoints
The following endpoints are available:

GET /api/: Retrieve paginated menu items.
POST /api/addItem: Add a new menu item with an optional image upload.
POST /api/deleteItem: Delete a menu item by index.
GET /api/getItemByIndex/:index: Retrieve a specific menu item by index.
POST /api/updateItem: Update an existing menu item by index with optional image upload.
For detailed information on each endpoint and their request/response formats, refer to the inline comments in the code.

### File Structure
`app.js`: Main entry point of the application.
`data/items.json`: JSON file storing the menu items.
`uploads/`: Directory to store uploaded images.
`README.md`: Project documentation.
`package.json`: NPM package configuration.
`node_modules/`: Directory containing project dependencies.

### Dependencies
`express`: Web application framework for Node.js.
`multer`: Middleware for handling multipart/form-data, primarily used for file uploads.
`cors`: Middleware to enable Cross-Origin Resource Sharing.
`body-parser`: Middleware to parse incoming request bodies.
`fs-promises`: Promisified file system module.
Other dependencies specified in package.json.