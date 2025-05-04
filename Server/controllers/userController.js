import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, message: "userId is required" });
        }

        const user = await userModel.findById(userId);
        console.log(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            userData: {
                name: user.name,
                email: user.email,
                password: user.password,
                isAccountVerified: user.isAccountVerified,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};