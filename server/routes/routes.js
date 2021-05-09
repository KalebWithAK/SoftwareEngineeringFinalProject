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

    // List users
    //  Send a GET request with the JSON:
    //      {
    //          "session_key": "ADMIN SESSION KEY"
    //      }
    //  If the fetch fails, the returned JSON will be:
    //      {
    //          "error": "ERROR HERE"
    //      }
    //  If the fetch succeeds, the returned JSON will be:
    //      {
    //          "users": [
    //              {
    //                  "user_id": USER ID,
    //                  "email": USER EMAIL,
    //                  "name": USER'S NAME,
    //                  "is_admin": true/false,
    //              },
    //              ....
    //          ]
    //      }
    router.route('/api/user/list')
            .all(user_routes.auth_required(dbpool))
            .all(user_routes.admin_required(dbpool))
            .get(user_routes.list_users(dbpool))

    // Delete a user
    //  Send a DELETE request with the JSON:
    //      {
    //          "session_key": "SESSION KEY",
    //          "user_id": USER TO DELETE,
    //      }
    //  If the delete fails, the returned JSON will be:
    //      {
    //          "error": "ERROR HERE"
    //      }
    //  If the delete succeeds, the returned JSON will be:
    //      {
    //          "success": true
    //      }
    router.route('/api/user/delete')
            .all(user_routes.auth_required(dbpool))
            .all(user_routes.admin_required(dbpool))
            .delete(user_routes.delete_user(dbpool))

    // Category routes

    // Listing categories
    //  Send a GET request and the returned JSON will be:
    //  {
    //      "categories": [
    //          {
    //              "category_id": CATEGORY ID,
    //              "title": "CATEGORY NAME",
    //              "creator_name": "CATEGORY CREATOR NAME"
    //          },
    //          ...
    //      ]
    //  }
    router.get('/api/category/list', category_routes.get_categories(dbpool))

    // Getting a category
    //  Send a GET request with the following JSON data:
    //      {
    //          "category_id": CATEGORY ID
    //      }
    //  If not successful, the response JSON will be:
    //      {
    //          "error": "ERROR HERE"
    //      }
    //  If the category was found, the response will be of the form:
    //      {
    //          "category_id": CATEGORY ID,
    //          "title": "CATEGORY NAME",
    //          "creator_name": "NAME OF CREATING USER"
    //      }
    router.get('/api/category/get', category_routes.get_category(dbpool))

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

    // List posts
    //  Send a GET request and the response will be of the form:
    //  {
    //      "posts": [
    //          {
    //              "post_id": POST ID,
    //              "creator_id": USER ID OF CREATOR,
    //              "creator_name": "NAME OF CREATOR",
    //              "category_id": ID OF CATEGORY,
    //              "title": "TITLE OF POST",
    //              "content": "POST CONTENT",
    //              "content_html": "RENDERED HTML POST",
    //              "created_timestamp": "TIME CREATED",
    //              "updated_timestamp": "TIME LAST UPDATED"
    //          },
    //          ...
    //      ]
    //  }
    router.get('/api/post/list', post_routes.get_posts(dbpool))

    //  Send a GET request with (some/all/none of) the following data:
    //      text: CONTENT/TITLE SEARCH,                     (Optional)
    //      before_date: POSTED BEFORE YYYY-MM-DD HH:MM:SS, (Optional)
    //      after_date: POSTED AFTER YYYY-MM-DD HH:MM:SS,   (Optional)
    //    Note: Use URL parameters for these, such as:
    //      URL?name1=val1&name2=val2& ...
    //  If an error occurs, the returned JSON will be:
    //      {
    //          "error": "ERROR HERE"
    //      }
    //  Otherwise, the returned JSON will be:
    //      {
    //          "posts": [
    //              {
    //                  "post_id": POST ID,
    //                  "creator_id": USER ID OF CREATOR,
    //                  "creator_name": "NAME OF CREATOR",
    //                  "category_id": ID OF CATEGORY,
    //                  "title": "TITLE OF POST",
    //                  "content": "POST CONTENT",
    //                  "content_html": "RENDERED HTML POST",
    //                  "created_timestamp": "TIME CREATED",
    //                  "updated_timestamp": "TIME LAST UPDATED"
    //              },
    //              ...
    //          ]
    //      }
    router.get('/api/post/query', post_routes.query_posts(dbpool))

    // Get a post
    //  Send a GET request, if the post was found, the response will be of the
    //  form:
    //      {
    //          "post_id": POST ID,
    //          "creator_id": USER ID OF CREATOR,
    //          "creator_name": "NAME OF CREATOR",
    //          "category_id": ID OF CATEGORY,
    //          "title": "TITLE OF POST",
    //          "content": "POST CONTENTS",
    //          "content_html": "MARKDOWN POST RENDERED AS HTML",
    //          "style": "CUSTOM CSS STYLING FOR THIS POST",
    //          "created_timestamp": "TIME CREATED",
    //          "updated_timestamp": "TIME LAST UPDATED"
    //      }
    router.get('/api/post/get/:id', post_routes.get_post(dbpool))

    // Get list of posts made by the same creator
    //  Send a GET request with the following data:
    //      creator_id: id of all the posts' creator
    //  If unsuccessful, the response JSON will be:
    //      {
    //          "error": "ERROR HERE"
    //      }
    // If any posts with the creator_id is found, the response will be of the form:
    //     [
    //          {
    //              "post_id": POST ID,
    //              "creator_id": USER ID OF CREATOR,
    //              "creator_name": "NAME OF CREATOR",
    //              "category_id": ID OF CATEGORY,
    //              "title": "TITLE OF POST",
    //              "content": "POST CONTENTS",
    //              "content_html": "MARKDOWN POST RENDERED AS HTML",
    //              "style": "CUSTOM CSS STYLING FOR THIS POST",
    //              "created_timestamp": "TIME CREATED",
    //              "updated_timestamp": "TIME LAST UPDATED"
    //          }
    //     ]
    router.get('/api/post/creatorlist/:creator_id', post_routes.get_creator_posts(dbpool))

    // Creating a post
    //  Send a PUT request with the following JSON data:
    //      {
    //          "session_key": "SESSION KEY",
    //          "category_id": CATEGORY ID,
    //          "title": "POST TITLE",
    //          "content": "POST CONTENT",
    //          "style": "CUSTOM CSS STYLING FOR THIS POST" (Optional)
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
    //          "style": "POST STYLE"           (Optional)
    //      }
    //  If the update fails, the returned JSON will be:
    //      {
    //          "error": "ERROR HERE"
    //      }
    //  If the update succeeds, the returned JSON will be:
    //      {
    //          "success": true
    //      }
    router.route('/api/post/update')
            .all(user_routes.auth_required(dbpool))
            .put(post_routes.update_post(dbpool))

    // Deleting a post
    //  Send a DELETE request with the following JSON data:
    //      {
    //          "session_key": "SESSION KEY",
    //          "post_id": POST ID
    //      }
    //  If the delete fails, the returned JSON will be:
    //      {
    //          "error": "ERROR HERE"
    //      }
    //  If the delete succeeds, the returned JSON will be:
    //      {
    //          "success": true
    //      }
    router.route('/api/post/delete')
            .all(user_routes.auth_required(dbpool))
            .delete(post_routes.delete_post(dbpool))

    return router
}
