Social Media Backend API (Unfinished)
=================

Note : This is an unfinished project And Docs Is Not Complete

API Documentation
=================

User Management
---------------

POST `/api/users`

Create a new user.

### Request:

Content-Type: `application/json`

    {
      "username": "yourusername",
      "email": "youremail@example.com",
      "password": "yourpassword"
    }
    

### Response:

    {
      "token": "YOUR\_JWT\_TOKEN"
    }
    

GET `/api/users/me`

Get current user's details.

### Request:

    x-auth-token: YOUR\_JWT\_TOKEN
    

### Response:

    {
      "_id": "USER_ID",
      "username": "yourusername",
      "email": "youremail@example.com",
      "followingCount": 0,
      "followersCount": 0,
      "followers": [],
      "following": []
    }
    

Authentication
--------------

POST `/api/auth`

Authenticate user and get token.

### Request:

Content-Type: `application/json`

    {
      "email": "youremail@example.com",
      "password": "yourpassword"
    }
    

### Response:

    {
      "token": "YOUR\_JWT\_TOKEN"
    }
    

Posts
-----

POST `/api/posts`

Create a new post.

### Request:

    Content-Type: application/json
    x-auth-token: YOUR\_JWT\_TOKEN

    {
      "title": "Post Title",
      "content": "Post content"
    }
    

### Response:

    {
      "_id": "POST_ID",
      "user": "USER_ID",
      "title": "Post Title",
      "content": "Post content",
      "date": "2024-06-24T12:00:00.000Z",
      "comments": []
    }
    

GET `/api/posts`

Get all posts.

### Response:

    [
      {
        "_id": "POST\ID",
        "user": {
          "_id": "USER_ID",
          "username": "userusername"
        },
        "title": "Post Title",
        "content": "Post content",
        "date": "2024-06-24T12:00:00.000Z",
        "comments": []
      }
    ]
    

Comments
--------

POST `/api/comments/:postId`

Add a comment to a post.

### Request:

    Content-Type: application/json
    x-auth-token: YOUR\_JWT\_TOKEN

    {
      "text": "This is a comment"
    }
    

### Response:

    [
      {
        "_id": "COMMENT_ID",
        "user": "USER_ID",
        "text": "This is a comment",
        "date": "2024-06-24T12:00:00.000Z",
        "replies":\[]
      }
    ]
    

POST `/api/comments/:postId/:commentId/replies`

Add a reply to a comment or a nested reply.

### Request:

    Content-Type: application/json
    x-auth-token: YOUR\_JWT\_TOKEN

    {
      "text": "This is a reply to a comment or a nested reply"
    }
    

### Response:

    [
      {
        "_id": "REPLY_ID",
        "user": "USER_ID",
        "text": "This is a reply to a comment or a nested reply",
        "date": "2024-06-24T12:00:00.000Z",
        "replies": []
      }
    ]
    

GET `/api/comments/:postId`

Get comments and replies for a post.

### Response:

    \[
      {
        "\_id": "COMMENT\_ID",
        "user": {
          "\_id": "USER\_ID",
          "username": "commenterusername"
        },
        "text": "This is a comment",
        "date": "2024-06-24T12:00:00.000Z",
        "replies": \[
          {
            "\_id": "REPLY\_ID",
            "user": {
              "\_id": "REPLY\_USER\_ID",
              "username": "replyusername"
            },
            "text": "This is a reply",
            "date": "2024-06-24T12:00:00.000Z",
            "replies": \[
              // Nested replies
            \]
          }
        \]
      }
    \]
    

Follow/Unfollow
---------------

PUT `/api/users/:id/follow`

Toggle follow/unfollow a user.

### Request:

    x-auth-token: YOUR\_JWT\_TOKEN
    

### Response:

{
  "msg": "Followed/Unfollowed successfully"
}
