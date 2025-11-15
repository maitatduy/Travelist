module.exports.list = async (req, res) => {
  res.render("admin/pages/category-list", {
    pageTitle: "Trang quản lý danh mục",
  });
};

module.exports.create = async (req, res) => {
  res.render("admin/pages/category-create", {
    pageTitle: "Trang tạo danh mục",
  });
};
