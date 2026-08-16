const User = require("../models/user");

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error("Profile error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

module.exports = {
    getProfile,
};