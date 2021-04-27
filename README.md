# SoftwareEngineeringFinalProject

### Dependencies

* `express` - Backend route management
* `promise-mysql` - Backend database management (with nice JS promises)
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

* Categories table:
```sql
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
CREATE TABLE `category` (
  `id` int(11) NOT NULL COMMENT 'The category ID',
  `creator_id` int(11) NOT NULL COMMENT 'The ID of the user who created this category',
  `title` varchar(64) COLLATE utf8_unicode_ci NOT NULL COMMENT 'The name of this category'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `CatTitle` (`title`);
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;
```

* Posts table:
```sql
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
CREATE TABLE `post` (
  `id` int(11) NOT NULL COMMENT 'The post ID',
  `creator_id` int(11) NOT NULL COMMENT 'The creating user''s ID',
  `category_id` int(11) NOT NULL COMMENT 'The creating user''s name',
  `title` varchar(64) NOT NULL COMMENT 'The title of the post',
  `content` text NOT NULL COMMENT 'The content within the post',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'The timestamp at which this post was created',
  `updated` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT 'The timestamp at which this post was last updated'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
ALTER TABLE `post`
  ADD PRIMARY KEY (`id`);
ALTER TABLE `post`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;
```

* Sessions table
```sql
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
CREATE TABLE `session` (
  `id` int(11) NOT NULL COMMENT 'The session ID',
  `session_key` varchar(32) COLLATE utf8_unicode_ci NOT NULL COMMENT 'The session''s key',
  `user_id` int(11) NOT NULL COMMENT 'The user''s ID',
  `expired` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Whether this session has expired',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'The timestamp at which the session was created'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
ALTER TABLE `session`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `SessionKey` (`session_key`);
ALTER TABLE `session`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
COMMIT;
```

* Users table
```sql
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
CREATE TABLE `user` (
  `id` int(11) NOT NULL COMMENT 'A unique integer representing this user''s ID',
  `email` varchar(128) COLLATE utf8_unicode_ci NOT NULL COMMENT 'A unique email address',
  `name` varchar(64) COLLATE utf8_unicode_ci NOT NULL COMMENT 'This user''s display name',
  `password_hash` varchar(150) COLLATE utf8_unicode_ci NOT NULL COMMENT 'This user''s password''s hash',
  `password_salt` varchar(32) COLLATE utf8_unicode_ci NOT NULL COMMENT 'The salt value used when generating the password''s hash',
  `admin` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Whether this user has administration permissions',
  `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Whether this user''s account has been deleted',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'The timestamp at which this account was created',
  `updated` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT 'The timestamp at which this account was last changed'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `EMAIL` (`email`);
ALTER TABLE `user`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'A unique integer representing this user''s ID', AUTO_INCREMENT=7;
COMMIT;
```

Finally, running `node server` will start the server. The server will be hosted on port `3001` (the ip and port will be printed to the console)
