const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh-secret";

const signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ msg: "Email already used" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashed,
    role: role === "admin" ? "admin" : "user",
  });

  // const accessToken = jwt.sign({ sub: user._id, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
  // const refreshToken = jwt.sign({ sub: user._id }, REFRESH_SECRET, { expiresIn: '7d' });

  // res.cookie('refreshToken', refreshToken, {
  //   httpOnly: true,
  //   sameSite: 'strict',
  //   maxAge: 7 * 24 * 60 * 60 * 1000,
  // });

  res.status(200).json({ status: true, message: "Signup Successfully" });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body, "req body");
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ status: false, msg: "Invalid credentials" });
  }

  const accessToken = jwt.sign({ sub: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ sub: user._id }, REFRESH_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ accessToken, user:{id:user.id, role:user.role, name:user.name, email:user.email} });
};

const logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ msg: "Logged out" });
};

const refresh = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);

  try {
    const payload = jwt.verify(token, REFRESH_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) return res.sendStatus(401);

    const accessToken = jwt.sign(
      { sub: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "15m" }
    );
    res.json({ accessToken });
  } catch (err) {
    res.sendStatus(401);
  }
};

module.exports = { signup, login, logout, refresh };
