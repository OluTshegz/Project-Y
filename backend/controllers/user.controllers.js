import User from "../models/user.models.js";

export const getUserProfile = async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username: username }).select("-password"); // exclude password from user data
        if (!user) {
            return res.status(404).json({ message: "User not found", error: `${error.message}` });
        }
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in getUserProfile user controller", error.message);
        res.status(500).json({ error: `Internal Server Error: ${error.message}. Please try again later` });
    }
};

export const getSuggestedUsers = async (req, res) => {};

export const followUnfollowUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userToFollowOrUnfollow  = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if (id === req.user._id.toString()) {
            return res.status(400).json({ message: "You cannot follow or unfollow yourself", error: `${error.message}` });
        }

        if (!userToFollowOrUnfollow || !currentUser) {
            return res.status(404).json({ message: "Users not found", error: `${error.message}` });
        }

        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {
            // Unfollow the User
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            res.status(200).json({ message: "User unfollowed succesfully" });
        }
        else {
            // Follow the User
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
            res.status(200).json({ message: "User followed succesfully" });
            // Send notification to the User
        }
    } catch (error) {}
};

export const updateUser = async (req, res) => {};
