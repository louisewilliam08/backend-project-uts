# Backend Programming - Kuis 1: Sistem Gacha Undian

Proyek ini mengimplementasikan sistem undian berbasis gacha menggunakan template Express.js + MongoDB.

---

## Setup

1. Copy `.env.example` ke `.env` dan sesuaikan:
   ```
   PORT=5000
   DB_CONNECTION=mongodb://localhost:27017/
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
{ "user_id": "69dd01249a5bde74784c8fe6" }
```

**Response (jika menang):**
```json
{
	"success": true,
	"message": "Congratulations! You won: Pulsa Rp50.000",
	"data": {
		"user_id": "69dd01249a5bde74784c8fe6",
		"prize": "Pulsa Rp50.000",
		"prize_id": 5,
		"gacha_count_today": 1,
		"remaining_gacha_today": 4
	}
}
```

**Response (jika tidak menang):**
```json
{
	"success": true,
	"message": "Hahaha, You got ZONK!!!",
	"data": {
		"user_id": "69dd01249a5bde74784c8fe6",
		"prize": "ZONK",
		"gacha_count_today": 3,
		"remaining_gacha_today": 2
	}
}
```

**Response (kuota habis — 403):**
```json
{
	"statusCode": 403,
	"error": "FORBIDDEN_ERROR",
	"description": "Access forbidden",
	"message": "Gacha limit reached. You have used 5/5 gacha today. Please try again tomorrow."
}
```

---

### 2. GET `/api/gacha/history/:user_id` — Histori Gacha *(Nomor Bonus)*

Menampilkan riwayat gacha user beserta hadiah yang dimenangkan.

**Contoh:** `GET /api/gacha/history/john_doe`

**Response:**
```json
{
	"user_id": "69dd01249a5bde74784c8fe6",
	"total_gacha": 5,
	"total_wins": 3,
	"history": [
		{
			"id": "69de61d57815138cf3e7451e",
			"timestamp": "2026-04-14T15:48:37.301Z",
			"prize": "Pulsa Rp50.000",
			"is_winner": true
		},
		{
			"id": "69de61d37815138cf3e7451a",
			"timestamp": "2026-04-14T15:48:35.328Z",
			"prize": "No Prizes",
			"is_winner": false
		},
		{
			"id": "69de61bc7815138cf3e74516",
			"timestamp": "2026-04-14T15:48:12.156Z",
			"prize": "No Prizes",
			"is_winner": false
		},
		{
			"id": "69de61b87815138cf3e74512",
			"timestamp": "2026-04-14T15:48:08.720Z",
			"prize": "Voucher Rp100.000",
			"is_winner": true
		},
		{
			"id": "69de617a7815138cf3e7450e",
			"timestamp": "2026-04-14T15:47:06.273Z",
			"prize": "Pulsa Rp50.000",
			"is_winner": true
		}
	]
}
```

---

### 3. GET `/api/gacha/prizes` — Daftar Hadiah & Kuota *(Nomor Bonus)*

Menampilkan semua hadiah beserta kuota total dan sisa kuota.

**Response:**
```json
{
	"success": true,
	"data": [
		{
			"id": 1,
			"name": "Emas 10 gram",
			"total_quota": 1,
			"winners_count": 0,
			"remaining_quota": 1
		},
		{
			"id": 2,
			"name": "Smartphone X",
			"total_quota": 5,
			"winners_count": 0,
			"remaining_quota": 5
		},
		{
			"id": 3,
			"name": "Smartwatch Y",
			"total_quota": 10,
			"winners_count": 0,
			"remaining_quota": 10
		},
		{
			"id": 4,
			"name": "Voucher Rp100.000",
			"total_quota": 100,
			"winners_count": 1,
			"remaining_quota": 99
		},
		{
			"id": 5,
			"name": "Pulsa Rp50.000",
			"total_quota": 500,
			"winners_count": 2,
			"remaining_quota": 498
		}
	]
}
```

---

### 4. GET `/api/gacha/winners` — Daftar Pemenang (Disamarkan) *(Nomor Bonus)*

Menampilkan pemenang per hadiah dengan user ID yang disamarkan.

**Response:**
```json
{
	"success": true,
	"note": "Names are masked for privacy",
	"data": [
		{
			"prize_id": 1,
			"prize_name": "Emas 10 gram",
			"winners": []
		},
		{
			"prize_id": 2,
			"prize_name": "Smartphone X",
			"winners": []
		},
		{
			"prize_id": 3,
			"prize_name": "Smartwatch Y",
			"winners": []
		},
		{
			"prize_id": 4,
			"prize_name": "Voucher Rp100.000",
			"winners": [
				{
					"name": "U**r S**u",
					"timestamp": "2026-04-14T15:48:08.720Z"
				}
			]
		},
		{
			"prize_id": 5,
			"prize_name": "Pulsa Rp50.000",
			"winners": [
				{
					"name": "U**r S**u",
					"timestamp": "2026-04-14T15:47:06.273Z"
				},
				{
					"name": "U**r S**u",
					"timestamp": "2026-04-14T15:48:37.301Z"
				}
			]
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