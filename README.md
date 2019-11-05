# Assignment 1 - Agile Software Practice.

Name: Yuting Jing

## Overview.

These codes can let users add and delete users, authors, poems and poems to their authors' works list. Users can register, login, logout, give thumbs up and take back the thumbs up to poems and author(thumbs up hasn't tested). We can also find poems by poemId, find authors by authorId, find users by userId. In login function, I also made a session-based authentication, which mainly learned from this link: https://medium.com/createdd-notes/starting-with-authentication-a-tutorial-with-node-js-and-mongodb-25d524ca0359, though not tested.

## API endpoints.

 + GET /users - Get all users.
 + GET /users/:id - Get a user by id.
 + GET /usersLogout - Get the user that logged in to logout.
 + GET /poems - Get all poems.
 + GET /poems/:id - Get all poems by id.
 + GET /authors - Get all authors.
 + GET /authors/:id - Get all authors by id.
 + POST /usersRegister - Let user register.
 + POST /users/login - Let user login.
 + POST /poems - Add a poem.
 + POST /authors - Add a poem.
 + PUT /authors/:id/work - Add a work for an author's works array
 + PUT /authors/:id/deletework - Delete a work for an author's works array
 + DELETE /users/:id - Delete a user from the database.
 + DELETE /poems/:id - Delete a poem from the database.


## Data model.


![][datamodel]


## Sample Test execution.

~~~
  Authors
    GET /authors
Successfully Connected to [ admin ]
(node:1292) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
GET /authors 200 20.362 ms - 653
GET /authors 200 20.362 ms - 653
      √ should return all the authors (57ms)
    GET /authors/:id
      when the id is valid
GET /authors/5dc1a6ab1c60c3050c20e224 200 25.329 ms - 416
GET /authors/5dc1a6ab1c60c3050c20e224 200 25.329 ms - 416
        √ should return the matching author
      when the id is invalid
GET /authors/9999 200 1.695 ms - 224
GET /authors/9999 200 1.695 ms - 224
        √ should return the NOT found message
    POST /authors
POST /authors 200 21.096 ms - 191
POST /authors 200 21.096 ms - 191
      √ should return confirmation message and update datastore (57ms)
GET /authors/5dc1a6ab1c60c3050c20e22a 200 6.730 ms - 230
GET /authors/5dc1a6ab1c60c3050c20e22a 200 6.730 ms - 230
    PUT /authors/:id/deleteWork
      when the id is valid
PUT /authors/5dc1a6ab1c60c3050c20e22b/deleteWork 200 24.274 ms - 377
PUT /authors/5dc1a6ab1c60c3050c20e22b/deleteWork 200 24.274 ms - 377
        √ should return a message and the author work is added
      when the id is invalid
PUT /authors/34343/deleteWork 200 0.538 ms - 227
PUT /authors/34343/deleteWork 200 0.538 ms - 227
        √ should return information is wrong
    PUT /authors/:id/works
      when the id is valid
PUT /authors/5dc1a6ab1c60c3050c20e22f/works 200 30.869 ms - 401
PUT /authors/5dc1a6ab1c60c3050c20e22f/works 200 30.869 ms - 401
        √ should return a message and the author work is added
GET /authors/5dc1a6ab1c60c3050c20e22f 200 43.587 ms - 469
GET /authors/5dc1a6ab1c60c3050c20e22f 200 43.587 ms - 469
      when the id is invalid
PUT /authors/34343/works 200 0.563 ms - 227
PUT /authors/34343/works 200 0.563 ms - 227
        √ should return information is wrong

  Users
    GET /users
GET /users 200 7.477 ms - 583
GET /users 200 7.477 ms - 583
      √ should return all the users
    GET /users/:id
      when the id is valid
GET /users/5dc1a6ac1c60c3050c20e235 200 11.035 ms - 293
GET /users/5dc1a6ac1c60c3050c20e235 200 11.035 ms - 293
        √ should return the matching user
      when the id is invalid
GET /users/9999 200 0.425 ms - 220
GET /users/9999 200 0.425 ms - 220
        √ should return the NOT found message
    POST /users/login
      when the logemail and logpassword are valid
POST /users/login 200 96.773 ms - 72
POST /users/login 200 96.773 ms - 72
        √ should return confirmation message and update datastore (111ms)
GET /users/5dc1a6ad1c60c3050c20e23a 200 6.927 ms - 292
GET /users/5dc1a6ad1c60c3050c20e23a 200 6.927 ms - 292
      when the logemail is invalid
POST /users/login 200 12.360 ms - 38
POST /users/login 200 12.360 ms - 38
        √ should return information is wrong
      when the logpassword is invalid
POST /users/login 200 154.913 ms - 38
POST /users/login 200 154.913 ms - 38
        √ should return information is wrong (164ms)
    POST /usersRegister
      when the all fields are filled and valid, password and passwordConf match
POST /usersRegister 200 155.131 ms - 262
POST /usersRegister 200 155.131 ms - 262
        √ should return the matching user (168ms)
GET /users/5dc1a6ae1c60c3050c20e241 200 22.678 ms - 303
GET /users/5dc1a6ae1c60c3050c20e241 200 22.678 ms - 303
      when the not all fields are filled
POST /usersRegister 200 0.409 ms - 33
POST /usersRegister 200 0.409 ms - 33
        √ should return the err message
      when the password and passwordConf dont match
POST /usersRegister 200 0.249 ms - 37
POST /usersRegister 200 0.249 ms - 37
        √ should return error message
    DELETE /users
      when the id is valid
(node:1292) DeprecationWarning: Mongoose: `findOneAndUpdate()` and `findOneAndDelete()` without the `useFindAndModify` option set to false are deprecated. See: https://mongoosejs.com/docs/deprecations.html#-findandmodify-
DELETE /users/5dc1a6af1c60c3050c20e246 200 97.762 ms - 40
DELETE /users/5dc1a6af1c60c3050c20e246 200 97.762 ms - 40
        √ should return confirmation message and delete datastore (108ms)
GET /users/5dc1a6af1c60c3050c20e246 200 35.613 ms - 2
GET /users/5dc1a6af1c60c3050c20e246 200 35.613 ms - 2
      when the id is invalid
DELETE /users/1100001 200 1.987 ms - 231
DELETE /users/1100001 200 1.987 ms - 231
        √ should return confirmation message and delete datastore
    GET /usersLogout
      when the id is valid
GET /usersLogout 200 57.236 ms - 35
GET /usersLogout 200 57.236 ms - 35
        √ should return the matching user (65ms)

  Poems
    GET /poems
GET /poems 200 56.705 ms - 338
GET /poems 200 56.705 ms - 338
      √ should return all the poems (64ms)
    GET /poems/:id
      when the id is valid
GET /poems/5dc1a6b01c60c3050c20e24f 200 16.586 ms - 165
GET /poems/5dc1a6b01c60c3050c20e24f 200 16.586 ms - 165
        √ should return the matching poem
      when the id is invalid
GET /poems/9999 200 0.596 ms - 220
GET /poems/9999 200 0.596 ms - 220
        √ should return the NOT found message
    POST /poems/login
      when the title and author are valid
POST /poems 200 21.558 ms - 137
POST /poems 200 21.558 ms - 137
        √ should return confirmation message and update datastore
GET /poems/5dc1a6b01c60c3050c20e254 200 24.675 ms - 166
GET /poems/5dc1a6b01c60c3050c20e254 200 24.675 ms - 166
      when the author not provided
POST /poems 200 24.019 ms - 119
POST /poems 200 24.019 ms - 119
        √ should return confirmation message and update datastore
GET /poems/5dc1a6b01c60c3050c20e257 200 82.412 ms - 136
GET /poems/5dc1a6b01c60c3050c20e257 200 82.412 ms - 136
    DELETE /poems
      when the id is valid
DELETE /poems/5dc1a6b01c60c3050c20e259 200 25.737 ms - 40
DELETE /poems/5dc1a6b01c60c3050c20e259 200 25.737 ms - 40
        √ should return confirmation message and delete datastore
GET /poems/5dc1a6b01c60c3050c20e259 200 47.317 ms - 2
GET /poems/5dc1a6b01c60c3050c20e259 200 47.317 ms - 2
      when the id is invalid
DELETE /poems/1100001 200 0.885 ms - 231
DELETE /poems/1100001 200 0.885 ms - 231
        √ should return confirmation message and delete datastore


  27 passing (7s)
~~~



[datamodel]: ./img/data_model.png
