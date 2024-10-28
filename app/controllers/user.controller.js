const { where } = require("sequelize");
const db = require("../models");
const User = db.user;
const Car = db.car;
const Cart = db.cart;

//user controller
exports.getUser = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;
    const { count, rows: Users } = await User.findAndCountAll({
      limit,
      offset,
    });
    const totalPages = Math.ceil(count / limit);
    res.status(200).json({
      totalUsers: count,
      totalPages,
      currentPage: page,
      data: Users.map((user) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        password: user.password,
        role_Id: user.role_Id,
      })),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "gagal mengambil data user" });
  }
};

//car controller

//create
exports.addCar = async (req, res) => {
  try {
    const { car_name, car_desc, car_spec, car_price } = req.body;
    const car_img = req.file ? req.file.filename : null;
    const newCar = await Car.create({ car_name, car_img, car_desc, car_spec, car_price });
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 8080}`;
    res.status(201).json({
      message: "data mobil berhasil ditambah",
      data: {
        car_name: newCar.car_name,
        car_desc: newCar.car_desc,
        car_spec: newCar.car_spec,
        car_price: newCar.car_price,
        car_img: car_img ? `${baseUrl}/uploads/${car_img}` : null, // URL gambar
      },
    });
  } catch (error) {
    res.status(500).json({ message: "gagal menambah data mobil" });
  }
};

//update
exports.updateCar = async (req, res) => {
  try {
    const { car_name, car_desc, car_spec, car_price } = req.body;
    const car_img = req.file ? req.file.filename : null;
    const car = await Car.findByPk(req.params.id);
    if (!car) {
      return res.status(404).json({ message: "mobil tidak ditemukan" });
    }
    await car.update({
      car_name: car_name || car.car_name,
      car_desc: car_desc || car.car_desc,
      car_spec: car_spec || car.car_spec,
      car_price: car_price || car.car_price,
      car_img: car_img || car.car_img,
    });
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 8080}`;
    res.status(201).json({
      message: "data mobil berhasil di update",
      data: {
        car_name: car.car_name,
        car_desc: car.car_desc,
        car_spec: car.car_spec,
        car_price: car.car_price,
        car_img: car_img ? `${baseUrl}/uploads/${car_img}` : `${baseUrl}/uploads/${car_img}`, // URL gambar
      },
    });
  } catch (error) {
    res.status(500).json({ message: "gagal mengupdate data mobil" });
  }
};

//read
exports.getCar = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;
    const { count, rows: Cars } = await Car.findAndCountAll({
      limit,
      offset,
    });
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 8080}`;
    const totalPages = Math.ceil(count / limit);
    res.status(200).json({
      totalItems: count,
      totalPages,
      currentPage: page,
      data: Cars.map((car) => ({
        car_id: car.car_id,
        car_name: car.car_name,
        car_desc: car.car_desc,
        car_spec: car.car_spec,
        car_price: car.car_price,
        car_img: car.car_img ? `${baseUrl}/uploads/${car.car_img}` : null,
      })),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "gagal mengambil data mobil" });
  }
};

//delete
exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id);
    if (!car) {
      return res.status(404).json({ message: "mobil tidak ditemukan" });
    }
    await car.destroy();
    res.status(200).json({ message: "data berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "gagal menghapus data mobil" });
  }
};

//cart controller
exports.addCart = async (req, res) => {
  try {
    const { user_id, car_id, quantity } = req.body;
    const car = await Car.findByPk(car_id);
    if (!car) {
      return res.status(404).json({ message: "mobil tidak ditemukan" });
    }

    const total_Price = car.car_price * (quantity || 1);
    const cartItem = await Cart.create({
      user_id,
      car_id,
      quantity: quantity || 1,
      total_price: total_Price,
    });

    res.status(201).json({
      message: "mobil berhasil ditambahkan ke keranjang",
      cartItem: {
        ...cartItem.dataValues,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({ message: "gagal menambah data" });
  }
};

exports.readCart = async (req, res) => {
  try {
    const { user_id } = req.params;

    const cartItems = await Cart.findAll({
      where: { user_id },
      include: [
        {
          model: Car,
          as: "car",
          attributes: ["car_name", "car_price"],
        },
      ],
    });

    if (cartItems.length === 0) {
      return res.status(404).json({ message: "keranjang kosong" });
    }

    const totalCartPrice = cartItems.reduce((total, item) => {
      return total + item.quantity * item.car.car_price;
    }, 0);

    res.status(200).json({
      message: "Keranjang berhasil diambil.",
      cartItems: cartItems.map((item) => ({
        id: item.id,
        car_name: item.car.car_name,
        quantity: item.quantity,
        car_price: item.car.car_price,
        total_price_per_item: item.quantity * item.car.car_price,
      })),
      totalCartPrice,
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data keranjang." });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const { action } = req.body;
    const { carts_id } = req.params;
    const cartItem = await Cart.findByPk(carts_id);

    if (!cartItem) {
      return res.status(404).json({ message: "item keranjang tidak ditemukan" });
    }

    const car = await Car.findByPk(cartItem.car_id);
    if (!car) {
      return res.status(404).json({ message: "mobil terkait tidak ditemukan" });
    }
    // Memperbarui quantity berdasarkan aksi yang diambil
    if (action === "increase") {
      cartItem.quantity += 1; // Jika aksi "tambah"
    } else if (action === "decrease" && cartItem.quantity > 1) {
      cartItem.quantity -= 1; // Jika aksi "kurangi" dan quantity lebih dari 1
    } else if (action === "decrease" && cartItem.quantity === 1) {
      return res.status(400).json({ message: "quantity minimal 1" });
    } else {
      return res.status(400).json({ message: "aksi tidak valid" });
    }
    // Menghitung ulang total price berdasarkan quantity baru
    cartItem.total_price = car.car_price * cartItem.quantity;
    // Menyimpan perubahan di database
    await cartItem.save();

    res.status(200).json({
      message: "keranjang berhasil diperbarui",
      cartItem: {
        ...cartItem.dataValues,
      },
    });
  } catch (error) {
    console.error();
    res.status(500).json({ message: "gagal memperbarui keranjang" });
  }
};

//delete cart
exports.deleteCart = async (req, res) => {
  try {
    const { carts_id } = req.params;
    const cartItem = await Cart.findByPk(carts_id);

    if (!cartItem) {
      return res.status(404).json({ message: "item keranjang tidak ditemukan" });
    }

    await cartItem.destroy();

    res.status(200).json({ message: "item keranjang berhasil dihapus" });
  } catch {
    res.status(500).json({ message: "gagal menghapus item keranjang" });
  }
};

//logout
exports.logOut = (req, res) => {
  res.status(200).send("anda telah keluar dari akun");
};
