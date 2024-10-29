## ecar-API
Projek ini merupakan API E-Commerce bertema mobil yang masih dalam tahap pengembangan

## Fitur

API ini memiliki fitur:

- **Autentikasi Menggunakan JWT**: Pengguna dapat Register dan Login menggunakan token JWT untuk mengakses endpoint yang dilindungi.
- **Cart**: Pengguna dapat menambah, mengupdate, dan menghapus item di keranjang belanja.

## Instalasi

- install dependensi
`npm install`
- jalankan program
`nodemon server.js`

## Instalasi Database
- buka aplikasi pgAdmin kemudian klik kanan pada database pilih "create" dan klik "database" kemudian beri nama database "ecar" dan klik "save"
- pilih database "ecar" yang baru dibuat kemudian klik kanan dan pilih "restore" dan klik icon file pada filename kemudian pilih "ecar.backup" yang sudah tersedia
- kemudian sesuaikan db.config.js dengan settingan postgresql yang sudah terinstall
`
