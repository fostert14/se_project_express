# WTWR Express Project

## Description

This project is a Node.js-based web application designed to manage clothing items. It offers a RESTful API that allows users to perform a variety of operations related to clothing items, such as creating, viewing, liking, and disliking items, as well as managing user profiles. The application serves as a backend platform, providing a robust API for front-end applications to interact with.

## Functionality

- **User Management**: Users can be created and retrieved, allowing for personalized interactions with the application.
- **Clothing Item Management**: Users can add new clothing items, view existing items, and delete them as needed.
- **Likes/Dislikes Feature**: Users can like or dislike clothing items, with the system ensuring each user can only like an item once.

## Technologies and Techniques Used

- **Node.js and Express**: This application is built on Node.js, using the Express framework for handling HTTP requests and structuring the application into routes and controllers for efficient request handling.
- **MongoDB with Mongoose**: MongoDB is used as the database solution, with Mongoose ODM for schema definition, data validation, and query building.
- **RESTful API Design**: This application follows RESTful principles, providing a clear and intuitive API for interacting with the application's resources.
- **Error Handling**: Comprehensive error handling is implemented to provide clear feedback and robustness, including handling of common HTTP error scenarios.
- **Security Best Practices**: Security measures like using Helmet for setting various HTTP headers are implemented to enhance the application's security.
- **Centralized Error Handling**: Utilizes a middleware-based approach to manage and respond to errors uniformly across the application, enhancing maintainability and consistency in error responses.
- **Request Validation Functions**:Employs the celebrate and Joi libraries to enforce input validation on API requests, ensuring data integrity and reducing the risk of invalid or malicious data affecting the backend processes.
- **Loggers**:Integrates winston and express-winston for comprehensive logging of requests and errors, facilitating easier debugging and monitoring of the application's health and usage patterns.

## Running the Project

`npm run start` — to launch the server

`npm run dev` — to launch the server with the hot reload feature

## Domain Names

**Front End**:
fosterwtwr.crabdance.com
www.fosterwtwr.crabdance.com
**Back End**:
api.fosterwtwr.crabdance.com

### Testing

Before committing your code, make sure you edit the file `sprint.txt` in the root folder. The file `sprint.txt` should contain the number of the sprint you're currently working on. For ex. 12
