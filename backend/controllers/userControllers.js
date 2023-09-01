const createHttpError = require("http-errors");
const bcrypt = require("bcrypt");
const validator = require("validator");

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

module.exports = {
  signup,
};
