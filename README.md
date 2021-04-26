# SoftwareEngineeringFinalProject

### Running the Server

To run the server from source, enter the `server/` directory, run `node install` to install the dependencies. Before running the server, create a `.env` file inside of the `server/` directory like so:
```
MYSQL_DB_ADDRESS=ip address for mysql server
MYSQL_DB_PORT=mysql server port number
MYSQL_DB_USERNAME=username for mysql server
MYSQL_DB_PASSWORD=password for mysql server
MYSQL_DB_NAME=name of database for the blog
```
Now, to set up the tables, run the following SQL commands in your MySQL database:
* TODO

Finally, running `node server` will start the server. The server will be hosted on port `3001` (the ip and port will be printed to the console)

### Dependencies

* `express` - Backend route management
* `mysql` - Backend database management
* `react` - Frontend handler

pages
- home
- post view
- create post
- settings

necessary features
- create a post
- search functionality

possible features
- multiple post owners (permissions)
- edit a post
