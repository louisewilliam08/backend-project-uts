# Backend Programming - Kuis 1: Sistem Gacha Undian

Proyek ini mengimplementasikan sistem undian berbasis gacha menggunakan template Express.js + MongoDB.

---

## Setup

1. Copy `.env.example` ke `.env` dan sesuaikan:
   ```
   PORT=5000
   DB_CONNECTION=mongodb://127.0.0.1:27017
   DB_NAME=gacha-db
   ```
2. `npm install` lalu `npm run dev`

---

## Endpoints

Base URL: `http://localhost:5000/api (bisa atur port sesuka hati)`

### 1. POST `/api/gacha` — Lakukan Gacha

Endpoint utama untuk melakukan undian (maks 5x/hari per user).

**Request Body:**
```json
{ "user_id": "john_doe" }
```

**Response (jika menang):**
```json
{
  "success": true,
  "message": "Selamat! Kamu memenangkan: Pulsa Rp50.000",
  "data": {
    "user_id": "john_doe",
    "prize": "Pulsa Rp50.000",
    "prize_id": 5,
    "gacha_count_today": 1,
    "remaining_gacha_today": 4
  }
}
```

**Response (tidak menang):**
```json
{
  "success": true,
  "message": "Kamu tidak memenangkan hadiah apapun kali ini. Coba lagi!",
  "data": { "user_id": "john_doe", "prize": null, "gacha_count_today": 2, "remaining_gacha_today": 3 }
}
```

**Response (kuota habis — 403):**
```json
{
  "statusCode": 403,
  "error": "FORBIDDEN_ERROR",
  "message": "Gacha limit reached. You have used 5/5 gacha today. Please try again tomorrow."
}
```

---

### 2. GET `/api/gacha/history/:user_id` — Histori Gacha *(Bonus)*

Menampilkan riwayat gacha user beserta hadiah yang dimenangkan.

**Contoh:** `GET /api/gacha/history/john_doe`

**Response:**
```json
{
  "user_id": "john_doe",
  "total_gacha": 7,
  "total_wins": 2,
  "history": [
    { "id": "...", "timestamp": "2025-04-14T10:30:00Z", "prize": "Pulsa Rp50.000", "is_winner": true },
    { "id": "...", "timestamp": "2025-04-14T09:15:00Z", "prize": "Tidak ada hadiah", "is_winner": false }
  ]
}
```

---

### 3. GET `/api/gacha/prizes` — Daftar Hadiah & Kuota *(Bonus)*

Menampilkan semua hadiah beserta kuota total dan sisa kuota.

**Response:**
```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "Emas 10 gram", "total_quota": 1, "winners_count": 0, "remaining_quota": 1 },
    { "id": 2, "name": "Smartphone X", "total_quota": 5, "winners_count": 1, "remaining_quota": 4 },
    { "id": 3, "name": "Smartwatch Y", "total_quota": 10, "winners_count": 0, "remaining_quota": 10 },
    { "id": 4, "name": "Voucher Rp100.000", "total_quota": 100, "winners_count": 5, "remaining_quota": 95 },
    { "id": 5, "name": "Pulsa Rp50.000", "total_quota": 500, "winners_count": 12, "remaining_quota": 488 }
  ]
}
```

---

### 4. GET `/api/gacha/winners` — Daftar Pemenang (Disamarkan) *(Bonus)*

Menampilkan pemenang per hadiah dengan user ID yang disamarkan.

**Response:**
```json
{
  "success": true,
  "note": "User IDs are masked for privacy",
  "data": [
    {
      "prize_id": 2,
      "prize_name": "Smartphone X",
      "winners": [{ "user_id": "j**n_d*e", "timestamp": "2025-04-14T08:00:00Z" }]
    }
  ]
}
```

> Penyamaran: ~50% karakter diganti `*`, kecuali karakter pertama & terakhir. Contoh: `jane_doe` → `j*n*_d*e`.

---

## Aturan Bisnis

| Aturan | Detail |
|--------|--------|
| Gacha per hari | Maks **5 kali** per `user_id` per hari |
| Kuota hadiah | Per **periode undian** (bukan per hari) |
| Log | Semua request dicatat di koleksi `gacha_logs` MongoDB |

### Daftar Hadiah

| No | Hadiah | Kuota |
|----|--------|-------|
| 1 | Emas 10 gram | 1 |
| 2 | Smartphone X | 5 |
| 3 | Smartwatch Y | 10 |
| 4 | Voucher Rp100.000 | 100 |
| 5 | Pulsa Rp50.000 | 500 |

---

## Cara Test di EchoAPI

1. Buat **New Request**
2. Pilih method (GET/POST) dan masukkan URL
3. Untuk POST `/api/gacha`: tab **Body → JSON**:
   ```json
   { "user_id": "nama_user_anda" }
   ```
4. Klik **Send** dan screenshot hasilnya