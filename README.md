# CC
Repository capstone project for cloud computing cohort.

URL : https://restful-api-service-hh2lgvepoq-et.a.run.app/

# Endpoint Dokumentasi
# **POST /register**

- Deskripsi : Mendaftarkan pengguna baru.

### Request Body
- **email**: String (required) - Alamat email pengguna.

- **password**: String (required) - Kata sandi pengguna.

- **name**: String (required) - Nama lengkap pengguna.


### Response

- 201 Created - Pendaftaran berhasil.

  ```json
  {
    "message": "Registration successful"
  }
  ```

- 400 Bad Request - Permintaan tidak valid.

  ```json
  {
    "error": "Error message"
  }
  ```

- 409 Conflict - Email pengguna sudah terdaftar.

  ```json
  {
    "error": "Username already exists"
  }
  ```

- 500 Internal Server Error - Terjadi kesalahan server.

  ```json
  {
    "error": "Internal server error"
  }
  ```

# **POST /login**

- Deskripsi : Melakukan proses login pengguna.

### Request Body

- **email**: String (required) - Alamat email pengguna.

- **password**: String (required) - Kata sandi pengguna.

### Response

- 200 OK - Login berhasil.

  ```json
  {
    "message": "Login berhasil",
    "token": String
  }
  ```

- 400 Bad Request - Permintaan tidak valid.

  ```json
  {
    "error": "Error message"
  }
  ```

- 401 Unauthorized - Email atau kata sandi tidak valid.

  ```json
  {
    "error": "Invalid username or password"
  }
  ```

- 500 Internal Server Error - Terjadi kesalahan server.

  ```json
  {
    "error": "Internal server error"
  }
  ```

# **GET /data**

- Deskripsi : Mengambil data makanan berdasarkan token pengguna.

### Request Headers

- **email**: String (required) - Token pengguna.

### Response

- 200 OK - Data makanan berhasil diambil.

```json
[
  {
    "food_id": 17,
    "month": 6,
    "year": 2023,
    "email": "user@example.com",
    "food_name": null,
    "quantity": 10,
    "purchase_date": "2023-06-14T17:00:00.000Z",
    "expiry_date": null,
    "category": "fruit",
    "photo_url": "null"
  }
]
```

- 401 Unauthorized - Token pengguna tidak valid.

  ```json
  {
    "error": "Unauthorized"
  }
  ```

- 500 Internal Server Error - Terjadi kesalahan server.

  ```json
  {
    "error": "Internal server error"
  }
  ```

# **POST /data**

- Deskripsi : Membuat data makanan baru.

### Request Headers

- **email**: String (required) - Token pengguna.

### Request Body

- **month**: Number (required) - Bulan pembelian makanan.

- **year**: Number (required) - Tahun pembelian makanan.

- **quantity**: Number (required) - Jumlah makanan.

- **purchase_date**: Date (required) - Tanggal pembelian makanan.

- **category**: String (required) - Kategori makanan (fruit, meat, atau vegetable).

### Response

- 201 Created - Data makanan berhasil dibuat.

  ```json
  {
    "message": "Data created successfully",
    "food_id": Number
  }
  ```

- 400 Bad Request - Permintaan tidak valid.

  ```json
  {
    "error": "Error message"
  }
  ```

- 401 Unauthorized - Token pengguna tidak valid.

  ```json
  {
    "error": "Unauthorized"
  }
  ```

- 500 Internal Server Error - Terjadi kesalahan server.

  ```json
  {
    "error": "Internal server error"
  }
  ```

# **GET /data/category/:category**

- Deskripsi : Mengambil data makanan berdasarkan kategori.

### Request Headers

- **email**: String (required) - Token pengguna.

### Request Parameters

- **category**: String (required) - Kategori makanan (fruit, meat, atau vegetable).

### Response

- 200 OK - Data makanan berhasil diambil.

  ```json
  [
    {
        "food_id": 17,
        "month": 6,
        "year": 2023,
        "email": "user@example.com",
        "food_name": "Mangga",
        "quantity": 10,
        "purchase_date": "2023-06-14T17:00:00.000Z",
        "expiry_date": "2023-06-14T17:00:00.000Z",
        "category": "fruit",
        "photo_url": "null"
    },
  ]
  ```

- 401 Unauthorized - Token pengguna tidak valid.

  ```json
  {
    "error": "Unauthorized"
  }
  ```

- 500 Internal Server Error - Terjadi kesalahan server.

  ```json
  {
    "error": "Internal server error"
  }
  ```

# **POST /data/upload/:foodId**

- Deskripsi : Mengunggah foto makanan.

### Request Headers

- **email**: String (required) - Token pengguna.

### Request Parameters

- **foodId**: String (required) - ID makanan.

### Request Body

- file: Binary (required) - File gambar makanan.

### Response

- 200 OK - Foto berhasil diunggah.

  ```json
  {
    "message": "Photo uploaded successfully",
    "photo_url": String
  }
  ```

- 400 Bad Request - Tidak ada file yang diunggah.

```json
{
  "error": "No file uploaded"
}
```

- 401 Unauthorized - Token pengguna tidak valid.

```json
{
  "error": "Unauthorized"
}
```

- 500 Internal Server Error - Terjadi kesalahan server.

```json
{
  "error": "Internal server error"
}
```
