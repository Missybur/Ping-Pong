#Missy Ping Pong App

This is a Ping Pong app with user authentication

Built with Node, Express and MongoDB

##Installation:

- run 'npm install'
- run app using 'npm start'

##Testing

- run npm test


Notes //

Database:

In order to access data and user information within the MongoDB database, open 2 terminals:

Terminal 1:

- type in 'mongod' to make sure that mongoDB is running

Terminal 2:

- type in 'mongo' into terminal
- type in 'use pingpong'
- type in 'show collections'
- type in 'db.users.find()''

In order to delete users from the database:

- type in 'db.users.drop()'