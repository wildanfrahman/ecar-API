const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
const upload = require("../middleware/mutler");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next();
  });
  //user
  app.get("/api/users", [authJwt.verifyToken, authJwt.isAdmin], controller.getUser);

  //car
  app.post("/api/car", [authJwt.verifyToken, authJwt.isAdmin], upload.single("car_img"), controller.addCar); //create car

  app.put("/api/car/:id", [authJwt.verifyToken, authJwt.isAdmin], upload.single("car_img"), controller.updateCar); //update car

  app.get("/api/car", [authJwt.verifyToken], controller.getCar); //get car

  app.delete("/api/car/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.deleteCar); //delete car

  //cart
  app.post("/api/cart", [authJwt.verifyToken], controller.addCart); //create cart

  app.get("/api/cart/:user_id", [authJwt.verifyToken], controller.readCart); //create cart

  app.put("/api/cart/:carts_id", [authJwt.verifyToken], controller.updateCart); //update cart

  app.delete("/api/cart/:carts_id", [authJwt.verifyToken], controller.deleteCart); //delete cart

  //log-out
  app.post("api/auth/logout", controller.logOut);
};
