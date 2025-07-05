import Users from "../models/Users.js";

const Profile = async (req, res) => {
  const id = req.userId;

  if (!id) {
    return res.status(400).json({ msg: "ID is required to fetch profile." });
  }

  try {
    const user = await Users.findById(id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    return res.json({
      success: true,
      name: user.name,
      email: user.email,
      registered: user.isAccountVerified,
      msg: "User profile fetched"
    });

  } catch (error) {
    return res.status(500).json({ success: false, msg: "Internal server error" });
  }
};

export default Profile;
