const allowedOrigin = process.env.CLIENT_URL || "*";

const setCorsHeaders = (res) => {
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
};

exports.allowMethods = (req, res, methods) => {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return false;
  }

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

exports.setCorsHeaders = setCorsHeaders;
