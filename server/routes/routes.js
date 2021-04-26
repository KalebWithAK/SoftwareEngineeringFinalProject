const category_routes = require('./category_routes')
const post_routes = require('./post_routes')
const user_routes = require('./user_routes')

const express = require('express')

module.exports = (dbpool) => {
    const router = express.Router()

    // User routes

    // Creating a user
    //  Send a PUT request with the JSON data:
    //      {
    //          "email": "EMAIL HERE",
    //          "password": "PASSWORD HERE",
    //      }
    //  If the account creation fails, the following JSON will be returned:
    //      {
    //          "error": "ERROR REASON HERE"
    //      }
    //  If the account creation succeeds, the returned JSON will be:
    //      {
    //          "success": true
    //      }
    router.put('/api/user/register', user_routes.create_user(dbpool))

    // Logging in
    //  Send a POST request with the following JSON data:
    //      {
    //          "email": "EMAIL HERE",
    //          "password": "PASSWORD HERE",
    //      }
    //  If the account login fails, the following JSON will be returned:
    //      {
    //          "error": "ERROR REASON HERE"
    //      }
    //  If the account login succeeds, the returned JSON will be:
    //      {
    //          "session_key": "RETURNED SESSION KEY HERE"
    //      }
    //    Where the session key is some unique identifier for this device's login
    //    The session key will be required for actions that need authentication
    router.post('/api/user/login', user_routes.login(dbpool))

    // Logging out
    //  Note: all that *needs* to be done to log a user out is "forget" the
    //  session key, but this doesn't deactivate it on the server. This route
    //  is responsible for doing that. After a session key is logged out, it
    //  cannot be used to make requests that require authentication.
    //
    //  Send a DELETE request with the following JSON data:
    //      {
    //          "session_key": "SESSION KEY"
    //      }
    //  If the logout fails, the returned JSON will be:
    //      {
    //          "error": "ERROR MESSAGE"
    //      }
    //  If the logout succeeds, the returned JSON will be:
    //      {
    //          "success": true
    //      }
    router.route('/api/user/logout')
            .all(user_routes.auth_required(dbpool))
            .delete(user_routes.logout(dbpool))

    // Category routes

    // Listing categories
    //  Send a GET request and the returned JSON will be:
    //  {
    //      "categories": [
    //          {
    //              "category_id": CATEGORY 1 ID,
    //              "title": "CATEGORY 1 NAME",
    //              "creator_name": "CATEGORY 1 CREATOR NAME"
    //          },
    //          {
    //              "category_id": CATEGORY 2 ID,
    //              "title": "CATEGORY 2 NAME",
    //              "creator_name": "CATEGORY 2 CREATOR NAME"
    //          },
    //          ...
    //      ]
    //  }
    router.get('/api/category/list', category_routes.get_categories(dbpool))

    // Creating categories
    //  Send a PUT request with the following JSON data:
    //      {
    //          "session_key": "ADMIN SESSION KEY",
    //          "title": "CATEGORY TITLE"
    //      }
    //  If the creation fails, the returned JSON will be:
    //      {
    //          "error": "ERROR HERE"
    //      }
    //  If the creation succeeds, the returned JSON will be:
    //      {
    //          "category_id": NEW CATEGORY ID
    //      }
    router.route('/api/category/create')
            .all(user_routes.auth_required(dbpool))
            .all(user_routes.admin_required(dbpool))
            .put(category_routes.create_category(dbpool))

    // Post routes

    // Creating a post
    //  Send a PUT request with the following JSON data:
    //      {
    //          "session_key": "SESSION KEY",
    //          "category_id": CATEGORY ID,
    //          "title": "POST TITLE",
    //          "content": "POST CONTENT"
    //      }
    //  If the creation fails, the returned JSON will be:
    //      {
    //          "error": "ERROR HERE"
    //      }
    //  If the creation succeeds, the returned JSON will be:
    //      {
    //          "post_id": NEW POST ID
    //      }
    router.route('/api/post/create')
            .all(user_routes.auth_required(dbpool))
            .put(post_routes.create_post(dbpool))

    // Updating a post
    //  Send a PUT request with the following JSON data (at least one of the
    //  optionals is required):
    //      {
    //          "session_key": "SESSION KEY",   (Required)
    //          "post_id": POST ID,             (Required)
    //          "category_id": CATEGORY ID,     (Optional)
    //          "title": "POST TITLE",          (Optional)
    //          "content": "POST CONTENT"       (Optional)
    //      }
    //  If the creation fails, the returned JSON will be:
    //      {
    //          "error": "ERROR HERE"
    //      }
    //  If the creation succeeds, the returned JSON will be:
    //      {
    //          "post_id": NEW POST ID
    //      }
    router.route('/api/post/update')
            .all(user_routes.auth_required(dbpool))
            .put(post_routes.update_post(dbpool))

    return router
}
