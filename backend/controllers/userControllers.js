const createHttpError = require("http-errors");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const UserModel = require("../models/User");
const ROLES_LIST = require("../config/roles_list");

// middleware for user signup
const signup = async (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const role = Number(req.body.role);
  const passwodRaw = req.body.password;

  try {
    if (!username || !email || !passwodRaw) {
      throw createHttpError(400, "Required fields are missing");
    }

    const existingUsername = await UserModel.findOne({
      username: username,
    }).exec();

    if (existingUsername) {
      throw createHttpError(
        409,
        "Username already exist. Please choose another one or login instead",
      );
    }

    const existingEmail = await UserModel.findOne({
      email: email,
    }).exec();

    if (existingEmail) {
      throw createHttpError(
        409,
        "Email already exist. Please choose another one or login instead",
      );
    }

    if (!validator.isEmail(email)) {
      throw createHttpError(400, "Inavalid Email Id");
    }

    if (!validator.isStrongPassword(passwodRaw)) {
      throw createHttpError(400, "Password not strong enough");
    }

    if (!Object.values(ROLES_LIST).includes(role)) {
      throw createHttpError(400, "Invalid role");
    }

    const passwodHashed = await bcrypt.hash(passwodRaw, 10);

    const rolesGiven = {};

    if (role === ROLES_LIST.Admin) {
      rolesGiven.Admin = ROLES_LIST.Admin;
    } else {
      rolesGiven.User = ROLES_LIST.User;
    }

    const newUser = await UserModel.create({
      username: username,
      email: email,
      password: passwodHashed,
      roles: rolesGiven,
    });

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

// middleware for user login
const login = async (req, res, next) => {
  const username = req.body.username;
  const passwodRaw = req.body.password;
  try {
    if (!username || !passwodRaw) {
      throw createHttpError(400, "Required fields are missing");
    }

    const user = await UserModel.findOne({ username: username })
      .select("+password +email")
      .exec();

    if (!user) {
      throw createHttpError(401, "User doesn't exist. Signup instead.");
    }

    const passwordMatch = await bcrypt.compare(passwodRaw, user.password);

    if (!passwordMatch) {
      throw createHttpError(401, "Invalid Credentials");
    }

    const roles = Object.values(user.roles);

    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: user.username,
          roles: roles,
          userId: user._id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" },
    );

    const refreshToken = jwt.sign(
      { username: user.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" },
    );

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      // sameSite: "None",
      // secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (error) {
    next(error);
  }
};

// middleware for user logout
const logout = async (req, res, next) => {
  const cookies = req.cookies;
  try {
    if (!cookies?.jwt) {
      throw createHttpError(404, "JWT cookie doesn't exist");
    }
    const refreshToken = cookies.jwt;
    const user = await UserModel.findOne({ refreshToken }).exec();

    user.refreshToken = "";
    await user.save();

    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      // secure: true,
    });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

// middleware for refresh the access token
const refreshAccessToken = async (req, res, next) => {
  const refreshToken = req.cookies?.jwt;
  try {
    if (!refreshToken) {
      throw createHttpError(401, "Refresh token is not given");
    }

    const user = await UserModel.findOne({ refreshToken }).exec();

    if (!user) {
      throw createHttpError(404, "No user has the provided token");
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (error, decoded) => {
        if (error || user.username !== decoded.username) {
          throw createHttpError(403, "Invalid token given");
        }

        const roles = Object.values(user.roles);

        const accessToken = jwt.sign(
          {
            UserInfo: {
              username: decoded.username,
              roles: roles,
              userId: user._id,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1h" },
        );
        res.status(200).json({ accessToken });
      },
    );
  } catch (error) {
    next(error);
  }
};

// middleware to get all user details
const getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await UserModel.find({
      $and: [
        { "roles.User": { $exists: true } },
        { "roles.Admin": { $exists: false } },
      ],
    });

    if (!allUsers) {
      throw createHttpError(404, "No user exist");
    }

    res.status(200).json(allUsers);
  } catch (error) {
    next(error);
  }
};

// middleware to get all Individual details including admin/admins
const getAllIndividuals = async (req, res, next) => {
  try {
    const allIndividuals = await UserModel.find({});

    if (!allIndividuals) {
      throw createHttpError(404, "No One Exists!");
    }

    res.status(200).json(allIndividuals);
  } catch (error) {
    next(error);
  }
};

// middleware to delete an individual account
const deleteIndividualAccount = async (req, res, next) => {
  const individualId = req.body.individualId;
  try {
    if (!individualId) {
      throw createHttpError(400, "Individual ID is required");
    }

    if (!mongoose.Types.ObjectId.isValid(individualId)) {
      throw createHttpError(400, "Individual ID is not in correct format");
    }

    const deletedAccountDetails = await UserModel.findOneAndDelete({
      _id: individualId,
    }).exec();

    if (!deletedAccountDetails) {
      throw createHttpError(404, "Individual not found");
    }

    res.status(200).json({ deletedAccountDetails });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  logout,
  refreshAccessToken,
  getAllUsers,
  getAllIndividuals,
  deleteIndividualAccount,
};
