# Backend Assessment - Plexus Studio Agung Alfatah

repository ini dibuat untuk memenuhi assestment test dari plexus studio

## Features

- **Authentication & Authorization**: menggunakan JWT Untuk autentikasi token
- **User Management**: User registration, login, profile management
- **Leaderboard**: menampilkan data leaderboard top N user berdasarkan skor
- **Simulasi Payment Untuk TopUp**: menggunakan database lock dari sequelize untuk mencegah race condition saat melakukan top up 
- **Battlepass Quest**: Mengassign quest kepada user sesuai dengan jenis battlepass
- **Admin Panel**: CRUD untuk beberapa master data dalam game
- **Caching**: integrasi dengan redis untuk menyimpan beberapa data sementara seperti token yang di blacklist dan data leaderboard 
- **Penjadwalan Update Otomatis**: menggunakan node-cron package untuk mengecek data battlepass yang sudah expired dan diupdate sesuai jadwal yang ditentukan
- **API Documentation**: menggunakan Swagger Documentation

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL dengan Sequelize ORM
- **Cache**: Redis
- **Authentication**: JWT
- **Validation**: Joi package
- **Documentation**: Swagger
- **Testing**: Jest
- **Penjadwalan Task**: node-cron

## yang perlu disiapkan

spastikan perangkat sudah menginstall :

- Node.js 
- MySQL (bisa menggunakan XAMPP, Laragon dll)
- Redis server (bisa merujuk ke link berikut: [redis](https://redis.io/downloads/#Redis_Open_Source) )
- npm manager ( biasanya npm sudah include dengan instalasi node js )

## Instalasi

1. **Clone Repository**
clone repository di folder yang anda pilih 
```bash
git clone <repository-url>
cd BE-Assessment
```

2. **Install dependencies**
lalu jalankan command berikut: 
```bash
npm install
```

3. **Environment Setup**
   
   copy env.sample lalu rename menjadi .env atau bisa menggunakan command berikut :
```bash
cp .env.sample .env
```

   update .env dan sesuaikan dengan konfigurasi di perangkat anda, berikut konfigurasi yang saya gunakan:
```env
PORT=3000

NODE_ENV=development

DB_HOST=localhost
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=assestment
DB_DIALECT=mysql
DB_PORT=3306
DB_LOGS=false
DB_TIMEZONE=+07:00

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

JWT_SECRET= assestment_plexus_@secret_key


BASE_URL=http://localhost:3000
```

4. **Setup Database**
   
   buat terlebih dahulu database baru sesuaikan nama database dengan DB_DATABASE yang ada di env lalu jalankan command berikut:
```bash
npm run migrate
```

   lalu jalankan command berikut:
```bash
npm run seed
```

    atau bisa langsung menjalan command berikut:
```bash
npm run migrate:fresh
```

## Menjalankan Project

setelah semua langkah sebelumnya dilakukan bisa langsung menjalan command berikut:
```bash
npm run dev
```

apabila output seperti dibawah keluar maka server berhasil dijalankan:
```bash
> be-assestment@1.0.0 dev
> nodemon src/index.js   

[nodemon] 3.1.10
[nodemon] to restart at any time, enter `rs`  
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node src/index.js`        
Running daily battlepass status update check...
Server is running on port 3000
Connected to Redis
```

maka server berhasil dijalankan, untuk pengecekan bisa dengan membuka browser dan masukan link berikut:
```
http://localhost:3000/
```

## API Documentation

Setelah server berhasil mengakses, untuk masuk ke halaman dokumentasi Swagger silahkan ubah url menjadi:
```
http://localhost:3000/api/docs
```

## Testing

testing disini hanya untuk mengetes concurrency pada endpoint topup bisa dijalan dengan command berikut:
```bash
npm run test
```

untuk melakukan testing node-cron bisa membuka file app.js dan uncomment line kode berikut setelah melakukan database seeding:
```javascript
scheduleBattlepassUpdate();
// testCron(); uncomment code ini untuk testing cron job setiap 10 detik
module.exports = app;
```


## Contoh API Requests
untuk memasukan token yang dibutuhkan di beberapa endpoint anda bisa mengklik tombol authorize dikanan atas dan memasukan token yang di generate di endpoint login dengan format
```
Bearer <token>
```

### 1. Registrasi Akun User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "player@example.com",
    "password": "Password123!",
    "role_name": "player"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "player@example.com",
    "password": "Password123!"
  }'
```

### 3. Membuat Profile User (Membutuhkan Token di Header / harus login terlebih dahulu)
```bash
curl -X 'POST' \
  'http://localhost:3000/api/user/create-profile' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyOGMwZmIyLTBiMGItNDI5Yi05NmIwLTc4MzQwZTcyMTc0ZCIsInJvbGVfbmFtZSI6InBsYXllciIsImlhdCI6MTc1MDgwMDYzNSwiZXhwIjoxNzUwODQzODM1fQ.gsjRCIx_QJTH9AQQStMWYzmPdP4hdauXJkhRK4L9e1U' \
  -H 'Content-Type: application/json' \
  -d '{
  "username": "johndoe"
}'Authorization: Bearer YOUR_JWT_TOKEN"
```
Setiap endpoint yang memiliki gambar gembok di bagian kanan maka itu memerlukan token autentikasi yang didapatkan dari token saat login


## Data Dummy User

setelah melakukan database seeder diawal maka sudah disediakan akun user dummy yang bisa digunakan untuk login
- **Email**: `example1@gmail.com` to `example100@gmail.com`
- **Password**: `Password123!`
- **Role**: `player`

untuk akun admin silahkan melakukan registrasi akun dengan role_name admin
