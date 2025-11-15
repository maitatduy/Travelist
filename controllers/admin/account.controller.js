const AccountAdmin = require("../../models/account-admin.model");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports.login = async (req, res) => {
  res.render("admin/pages/login", {
    pageTitle: "Trang đăng nhập",
  });
};

module.exports.loginPost = async (req, res) => {
  const { email, password } = req.body;

  const existAccount = await AccountAdmin.findOne({
    email: email,
  });

  if (!existAccount) {
    res.json({
      code: "error",
      message: "Email không tồn tại trong hệ thống!",
    });
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, existAccount.password);
  if (!isPasswordValid) {
    res.json({
      code: "error",
      message: "Mật khẩu không đúng!",
    });
    return;
  }

  if (existAccount.status != "active") {
    res.json({
      code: "error",
      message: "Tài khoản chưa được kích hoạt!",
    });
    return;
  }

  // Tạo JWT token
  const token = jwt.sign(
    {
      id: existAccount._id,
      email: existAccount.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" } // Token có thời hạn 1 ngày
  );

  // Gửi token về cho client
  res.cookie("token", token, {
    maxAge: 24 * 60 * 60 * 1000, // Cookie có thời hạn 1 ngày
    httpOnly: true, // Chỉ cho phép truy cập cookie từ phía server
    sameSite: "strict", // Ngăn chặn CSRF
  });

  res.json({
    code: "success",
    message: "Đăng nhập tài khoản thành công!",
  });
};

module.exports.register = async (req, res) => {
  res.render("admin/pages/register", {
    pageTitle: "Trang đăng ký",
  });
};

module.exports.registerPost = async (req, res) => {
  const { fullName, email, password } = req.body;

  const existAccount = await AccountAdmin.findOne({
    email: email,
  });

  if (existAccount) {
    res.json({
      code: "error",
      message: "Email đã tồn tại trong hệ thống!",
    });
    return;
  }

  // Mã hóa mật khẩu với bcryptjs
  const salt = await bcrypt.genSalt(10); // Tạo ra chuỗi ngẫu nhiên với 10 ký tự
  const hashedPassword = await bcrypt.hash(password, salt); // Mã hóa mật khẩu

  const newAccount = new AccountAdmin({
    fullName: fullName,
    email: email,
    password: hashedPassword,
    status: "initial",
  });

  await newAccount.save();

  res.json({
    code: "success",
    message: "Đăng ký tài khoản thành công!",
  });
};

module.exports.registerInitial = async (req, res) => {
  res.render("admin/pages/register-initial", {
    pageTitle: "Tài khoản đã được khởi tạo",
  });
};

module.exports.forgotPassword = async (req, res) => {
  res.render("admin/pages/forgot-password", {
    pageTitle: "Trang quên mật khẩu",
  });
};

module.exports.otpPassword = async (req, res) => {
  res.render("admin/pages/otp-password", {
    pageTitle: "Trang nhập mã OTP",
  });
};

module.exports.resetPassword = async (req, res) => {
  res.render("admin/pages/reset-password", {
    pageTitle: "Trang đổi mật khẩu",
  });
};
