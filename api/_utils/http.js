exports.allowMethods = (req, res, methods) => {
  if (methods.includes(req.method)) {
    return true;
  }

  res.setHeader("Allow", methods.join(", "));
  res.status(405).json({ message: "Method not allowed" });
  return false;
};

exports.runAuth = (req, res, authMiddleware) => {
  return new Promise((resolve) => {
    authMiddleware(req, res, () => resolve(true));

    if (res.writableEnded) {
      resolve(false);
    }
  });
};
