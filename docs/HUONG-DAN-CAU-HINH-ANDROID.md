# Hướng dẫn cấu hình Pethouse trên Android (APK)

Tài liệu này mô tả cách chạy app **Pethouse** dưới dạng APK trên các môi trường Android khác nhau.

---

## Tổng quan kiến trúc

```
[APK trên Android]  ──HTTP──►  [Backend Spring Boot :9090]  ──►  [PostgreSQL Neon]
       ▲
       └── Giao diện đã đóng gói sẵn trong APK (không cần npm run dev)
```

| Thành phần | Bắt buộc khi dùng APK? | Lệnh chạy |
|---|---|---|
| **Backend** | Có | `cd backend` → `..\mvnw.cmd spring-boot:run` |
| **Frontend dev** | Không | Chỉ cần khi sửa code web và build lại APK |
| **Database** | Tự động | Đã cấu hình cloud trong `application.yml` |

---

## Yêu cầu trước khi bắt đầu

### Phần mềm trên máy tính

- **JDK 21** — `JAVA_HOME` trỏ tới JDK 21 (ví dụ `D:\APPS\Java\jdk-21.0.11`)
- **Node.js 18+** — cho build frontend
- **Android SDK** (tùy chọn) — chỉ cần khi build APK bằng Gradle

### Chạy backend

```powershell
cd d:\Pethouse\backend
$env:JAVA_HOME = "D:\APPS\Java\jdk-21.0.11"
..\mvnw.cmd spring-boot:run
```

Đợi dòng: `Started PethouseApplication`  
Kiểm tra: http://localhost:9090/actuator/health → `{"status":"UP"}`

### Tắt backend (giải phóng cổng 9090)

- Trong terminal đang chạy backend: `Ctrl + C`
- Hoặc PowerShell:

```powershell
Get-NetTCPConnection -LocalPort 9090 -State Listen | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

---

## Cấu hình API — file quan trọng nhất

Chỉnh file `frontend/.env.production` **trước khi build APK**:

```env
VITE_API_HOST=http://<ĐỊA-CHỈ-PHÙ-HỢP>:9090
```

| Môi trường | Giá trị `VITE_API_HOST` | Ghi chú |
|---|---|---|
| **Android Studio Emulator** | `http://10.0.2.2:9090` | `10.0.2.2` = localhost máy host |
| **LDPlayer / Nox / BlueStacks** | `http://<IP-WiFi-PC>:9090` | Dùng IP thật, **không** dùng `10.0.2.2` |
| **Điện thoại Android thật** | `http://<IP-WiFi-PC>:9090` | PC và điện thoại **cùng WiFi** |
| **Trình duyệt trên PC** | `http://localhost:9090` | Chỉ khi `npm run dev`, không dùng cho APK |

### Lấy IP WiFi máy tính

```powershell
ipconfig
```

Tìm **IPv4** của adapter **Wi-Fi** (ví dụ `192.168.1.189`).

> **Lưu ý:** Mỗi lần đổi `VITE_API_HOST` phải **build lại APK** (xem mục Build APK).

---

## Build APK

```powershell
cd d:\Pethouse\frontend
npm run cap:apk
```

File APK:

- `frontend\android\app\build\outputs\apk\debug\app-debug.apk`
- Bản copy tiện dùng: `D:\Pethouse\Pethouse-debug.apk`

---

## Trường hợp 1: Android Studio Emulator

### Cấu hình

`frontend/.env.production`:

```env
VITE_API_HOST=http://10.0.2.2:9090
```

### Cài APK

```powershell
# Giả lập phải đang chạy
D:\APPS\android-sdk\platform-tools\adb.exe devices

D:\APPS\android-sdk\platform-tools\adb.exe install -r D:\Pethouse\Pethouse-debug.apk
```

### Kiểm tra kết nối (trong giả lập)

Chrome → `http://10.0.2.2:9090/actuator/health`

### ADB

- `adb devices` tự nhận giả lập khi emulator đang chạy
- Không cần `adb connect`

---

## Trường hợp 2: LDPlayer 9

LDPlayer **không** dùng chung cơ chế mạng với Android Studio Emulator.

### Cấu hình

`frontend/.env.production`:

```env
VITE_API_HOST=http://192.168.1.189:9090
```

(Thay `192.168.1.189` bằng IP WiFi thực tế của máy tính.)

Build lại APK sau khi sửa file.

### Cài APK (cách đơn giản)

Kéo thả file `Pethouse-debug.apk` vào cửa sổ LDPlayer.

### Bật ADB trên LDPlayer (nếu cần dùng adb)

1. Mở LDPlayer → **Cài đặt** (bánh răng)
2. **Khác** / **Other settings** → bật **ADB debugging**
3. Khởi động lại LDPlayer

```powershell
D:\APPS\android-sdk\platform-tools\adb.exe kill-server
D:\APPS\android-sdk\platform-tools\adb.exe start-server
D:\APPS\android-sdk\platform-tools\adb.exe connect 127.0.0.1:5555
D:\APPS\android-sdk\platform-tools\adb.exe devices
```

Nếu cổng `5555` không được, thử `5557`, `5559` (mỗi instance LDPlayer một port).

```powershell
D:\APPS\android-sdk\platform-tools\adb.exe install -r D:\Pethouse\Pethouse-debug.apk
```

### Kiểm tra kết nối (trong LDPlayer)

Chrome → `http://192.168.1.189:9090/actuator/health`

### Lưu ý LDPlayer

- `adb devices` trống khi LDPlayer chưa bật ADB hoặc chưa `adb connect`
- LDPlayer cài tại: `D:\LDPlayer\LDPlayer9` (có thể khác trên máy khác)

---

## Trường hợp 3: Nox Player

Tương tự LDPlayer — dùng **IP WiFi máy tính**, không dùng `10.0.2.2`.

### Cấu hình

```env
VITE_API_HOST=http://<IP-WiFi-PC>:9090
```

### ADB (thường dùng cổng 62001 cho instance đầu)

```powershell
D:\APPS\android-sdk\platform-tools\adb.exe connect 127.0.0.1:62001
D:\APPS\android-sdk\platform-tools\adb.exe devices
```

Hoặc kéo thả APK vào cửa sổ Nox.

### Kiểm tra

Chrome trong Nox → `http://<IP-WiFi-PC>:9090/actuator/health`

---

## Trường hợp 4: BlueStacks

Dùng **IP WiFi máy tính**.

### ADB

Bật ADB trong BlueStacks Settings → Advanced → Android Debug Bridge.

```powershell
D:\APPS\android-sdk\platform-tools\adb.exe connect 127.0.0.1:5555
```

Có thể cần dùng BlueStacks bundled adb tùy phiên bản.

---

## Trường hợp 5: Điện thoại Android thật

### Cấu hình

```env
VITE_API_HOST=http://<IP-WiFi-PC>:9090
```

Build lại APK → copy sang điện thoại → cài (cho phép **Nguồn không xác định**).

### Điều kiện

- Điện thoại và máy tính **cùng WiFi**
- Backend đang chạy trên máy tính
- Firewall Windows cho phép cổng **9090**

### Kiểm tra

Trên điện thoại, Chrome → `http://<IP-WiFi-PC>:9090/actuator/health`

---

## Trường hợp 6: Chạy web trên trình duyệt (không dùng APK)

Không cần build APK.

```powershell
# Terminal 1 — Backend
cd d:\Pethouse\backend
$env:JAVA_HOME = "D:\APPS\Java\jdk-21.0.11"
..\mvnw.cmd spring-boot:run

# Terminal 2 — Frontend
cd d:\Pethouse\frontend
npm run dev
```

- PC: http://localhost:5173
- Điện thoại cùng WiFi: http://\<IP-WiFi-PC\>:5173

File `frontend/.env` (không phải `.env.production`):

```env
VITE_API_HOST=http://192.168.1.189:9090
```

---

## Firewall Windows

Nếu giả lập / điện thoại không truy cập được backend, chạy PowerShell **Run as Administrator**:

```powershell
netsh advfirewall firewall add rule name="Pethouse Backend 9090" dir=in action=allow protocol=TCP localport=9090
netsh advfirewall firewall add rule name="Pethouse Frontend 5173" dir=in action=allow protocol=TCP localport=5173
```

---

## Tài khoản test

| Username | Password |
|---|---|
| `guest_user` | `guest_password` |

Hoặc đăng ký tài khoản mới trong app.

---

## Xử lý sự cố

### Login quay tròn lâu, không có log trên backend

| Nguyên nhân | Cách xử lý |
|---|---|
| Sai `VITE_API_HOST` trong APK | Sửa `.env.production` → `npm run cap:apk` → cài lại APK |
| Dùng `10.0.2.2` trên LDPlayer | Đổi sang IP WiFi máy tính |
| Backend chưa chạy | Chạy `mvnw spring-boot:run` |
| Firewall chặn | Mở cổng 9090 (xem mục Firewall) |
| APK cũ chưa gỡ | Gỡ app → cài APK mới |

### Backend báo `Port 9090 was already in use`

```powershell
Get-NetTCPConnection -LocalPort 9090 -State Listen | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

### `adb devices` trống (LDPlayer / Nox)

1. Bật ADB trong cài đặt giả lập
2. `adb connect 127.0.0.1:<port>` (port tùy giả lập)
3. Hoặc cài APK bằng kéo thả

### Login có log `Bad credentials`

Kết nối **đã OK** — chỉ sai username/password.

### Database phản hồi chậm (10–30 giây)

Database Neon (cloud) có thể “ngủ” khi idle. Đợi thêm hoặc thử lại.

---

## Quy trình nhanh khi đổi môi trường

1. Sửa `frontend/.env.production` theo bảng ở trên
2. `cd frontend` → `npm run cap:apk`
3. Gỡ app cũ trên thiết bị / giả lập
4. Cài `Pethouse-debug.apk` mới
5. Chạy backend
6. Test URL health trên trình duyệt trong giả lập / điện thoại
7. Mở app và đăng nhập

---

## Cấu trúc file liên quan

```
Pethouse/
├── backend/                          # Spring Boot API (:9090)
├── frontend/
│   ├── .env.production               # API host khi build APK ← QUAN TRỌNG
│   ├── src/config/api.js             # Đọc VITE_API_HOST
│   ├── capacitor.config.json         # Cấu hình Capacitor
│   └── android/                      # Project Android native
├── Pethouse-debug.apk                # APK debug (sau khi build)
└── docs/
    └── HUONG-DAN-CAU-HINH-ANDROID.md # File này
```

---

## Script npm hữu ích

| Lệnh | Mô tả |
|---|---|
| `npm run dev` | Chạy web dev (trình duyệt) |
| `npm run build` | Build frontend production |
| `npm run cap:sync` | Build + đồng bộ vào project Android |
| `npm run cap:apk` | Build + tạo file APK debug |

---

*Tài liệu cập nhật: tháng 6/2026 — Pethouse Capacitor Android*
