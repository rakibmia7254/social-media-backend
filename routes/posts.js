const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Post = require("../models/Post");
const User = require("../models/User");

router.post("/", auth, async (req, res) => {
  const { title, content } = req.body;

  try {
    const newPost = new Post({
      user: req.user.id,
      title,
      content,
    });

    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/getFollowingPosts", auth, async (req, res) => {
  const user = await User.findById(req.user.id).populate("following");
  const posts = await Post.find({ user: { $in: user.following } }).sort({
    date: -1,
  });
  res.json(posts);
});

router.post('/:postId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const newComment = {
      user: req.user.id,
      text: req.body.text,
      replies: [],
    };

    post.comments.unshift(newComment);
    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/:postId/:commentId/replies', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const comment = findCommentById(post.comments, req.params.commentId);
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    const newReply = {
      user: req.user.id,
      text: req.body.text,
      replies: [],
    };

    comment.replies.unshift(newReply);
    await post.save();

    res.json(comment.replies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post("/:postId/comments/:commentId/replies", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    const comment = findCommentById(post.comments, req.params.commentId);
    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    const newReply = {
      user: req.user.id,
      text: req.body.text,
      replies: [],
    };

    comment.replies.unshift(newReply);
    await post.save();

    res.json(comment.replies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Recursive function to find comment or reply by ID
function findCommentById(comments, commentId) {
  for (let comment of comments) {
    if (comment.id === commentId) {
      return comment;
    }
    const nestedComment = findCommentById(comment.replies, commentId);
    if (nestedComment) {
      return nestedComment;
    }
  }
  return null;
}


router.get("/:postId/comments", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId).populate({
      path: "comments.user",
      select: "username",
      populate: {
        path: "replies.user",
        select: "username",
        populate: {
          path: "replies.user", // Infinite nesting support
          select: "username",
        },
      },
    });

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
