import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(401).json({
        message: "error",
        success: false
      })
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({
        message: "error email already exits",
        success: false
      })
    };
    const hash = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: hash,
    });
    return res.status(201).json({
      message: "account create",
      success: true
    })
  } catch (error) {
    console.log(error);
  }
}


export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        message: "error",
        success: false
      })
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    const isPaaswordmatch = await bcrypt.compare(password, user.password as string);
    if (!isPaaswordmatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
      message: `Welcome back ${userData.name}`,
      success: true,
      user: userData,
      token: token
    });
  } catch (error) {
    console.log(error);
  }
}

export const logout = async (_: Request, res: Response) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: 'Logged out successfully.',
      success: true
    });
  } catch (error) {
    console.log(error);
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { googleToken } = req.body;
    if (!googleToken) {
      return res.status(400).json({ message: "Google token is required", success: false });
    }

    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ message: "Invalid Google token", success: false });
    }

    const email = payload.email;
    const name = payload.name || "Google User";

    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-8) + email, 10);
      user = await User.create({
        name,
        email,
        password: randomPassword,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });

    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
      message: `Welcome back ${userData.name}`,
      success: true,
      user: userData,
      token: token
    });

  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: "Google Login Failed" });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false
      });
    }
    return res.status(200).json({
      message: "User details fetched successfully",
      success: true,
      user: user
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};
