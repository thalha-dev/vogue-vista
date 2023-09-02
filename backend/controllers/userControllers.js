const createHttpError = require("http-errors");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/User");
const ROLES_LIST = require("../config/roles_list");

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

    const newUser = await UserModel.create({
      username: username,
      email: email,
      password: passwodHashed,
      roles: {
        User: ROLES_LIST.User,
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

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

    const passwordMatch = bcrypt.compare(passwodRaw, user.password);

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
      { expiresIn: "120s" },
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
      sameSite: "None",
      // secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (error) {
    next(error);
  }
};

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

module.exports = {
  signup,
  login,
  logout,
};
