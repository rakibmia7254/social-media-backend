const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

router.put("/:id/follow", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    const isFollowing = user.following.includes(targetUser.id);

    if (isFollowing) {
      // Unfollow the user
      user.following = user.following.filter(
        (userId) => userId.toString() !== targetUser.id
      );
      user.followingCount--;
      await user.save();

      targetUser.followers = targetUser.followers.filter(
        (userId) => userId.toString() !== user.id
      );
      targetUser.followersCount--;
      await targetUser.save();

      res.json({
        msg: "User unfollowed",
        following: user.following,
        followingCount: user.followingCount,
        followers: targetUser.followers,
        followersCount: targetUser.followersCount,
      });
    } else {
      // Follow the user
      user.following.push(targetUser.id);
      user.followingCount++;
      await user.save();

      targetUser.followers.push(user.id);
      targetUser.followersCount++;
      await targetUser.save();

      res.json({
        msg: "User followed",
        following: user.following,
        followingCount: user.followingCount,
        followers: targetUser.followers,
        followersCount: targetUser.followersCount,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/following", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("following");
    const posts = await Post.find({ user: { $in: user.following } }).sort({
      date: -1,
    });

    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
