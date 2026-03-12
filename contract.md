# 📋 PROJECT CONTRACT - Absensi Kerja 9-5

> **Source of Truth untuk semua development activity**

**Project Name:** AI Trainer - Absensi Kerja
**Version:** 1.0
**Last Updated:** 2026-03-09
**Maintainer:** AI Developer

---

## 🎯 PROJECT OVERVIEW

### Vision
Aplikasi absensi kerja berbasis web yang modern dan interaktif, dirancang untuk melacak kehadiran karyawan dan secara spesifik membatasi waktu check-in hanya antara pukul 09:00 hingga 17:00 waktu lokal.

### Core Objectives
- [x] Mencatat status kehadiran pengguna.
- [x] Memvalidasi fungsi check-in secara ketat hanya pada pukul 09:00 - 17:00.
- [x] Mencegah check-in di luar jam kerja dengan feedback visual yang informatif.
- [x] Antarmuka yang estetis (premium, dinamis, dengan palet warna harmonis dan animasi mikro).

### Success Criteria
- Validasi batasan waktu 09:00-17:00 berfungsi akurat dalam UI.
- Render frontend performa tinggi dengan respon interaksi cepat (< 100ms).
- Memiliki visual interface premium (Glassmorphism, animasi mulus, font modern, no raw CSS feel).
- 100% mengikuti standar penulisan kode React modern (Functional component + hooks).

---

## 🏗️ ARCHITECTURE

### Tech Stack
```
Frontend:  React 18 + TypeScript + Vite
Styling:   Vanilla CSS (Modern CSS variables, flex/grid, micro-animations)
State Mgt: React Hooks (useState, useEffect, useMemo)
```

### Folder Structure
```
ai-trainer/
├── src/
│   ├── components/
│   │   ├── Clock.tsx
│   │   ├── CheckInButton.tsx
│   │   ├── StatusCard.tsx
│   │   └── Layout.tsx
│   ├── hooks/
│   │   └── useTimeValidation.ts
│   ├── utils/
│   │   └── timeFormatters.ts
│   ├── styles/
│   │   ├── index.css
│   │   └── variables.css
│   ├── App.tsx
│   └── main.tsx
├── contract.md
├── agent.md
└── mistake.md
```

---

## 🎬 FEATURE SPECIFICATIONS

### Feature 1: Live Time Tracker & Check-in System
**Priority:** High
**Status:** Planned

**Description:**
Sistem menampilkan waktu berjalan secara real-time dan mengevaluasi status (Dalam Jam Kerja / Di Luar Jam Kerja). Tombol check-in hanya aktif jika kondisi waktu terpenuhi.

**Acceptance Criteria:**
- [ ] Menampilkan jam real-time.
- [ ] Tombol Check-in disabled/terkunci jika waktu < 09:00 atau > 17:00.
- [ ] Menampilkan pesan error spesifik jika mencoba absen di luar waktu.
- [ ] Menyimpan status berhasil absen.

**Design Requirements:**
- UI: Mewah dan premium. Efek glassmorphism pada card, gradient background yang hidup (contoh mesh gradient).
- Typography: Menggunakan font modern (misal: 'Inter' atau 'Outfit').
- Transisi: Hover efek pada tombol, transisi disable/enable dengan animasi smooth.

### Feature 2: Monthly Attendance Calendar
**Priority:** Medium
**Status:** Completed

**Description:**
Sistem menampilkan grid kalender per-bulan yang menunjukkan riwayat presensi harian dengan skema warna yang informatif.

**Acceptance Criteria:**
- [x] Menampilkan Hari dan matrik tanggal (Minggu - Sabtu).
- [x] Menggunakan warna Hijau untuk Hadir, Kuning untuk Terlambat, Merah untuk Alpha (Mangkir), dan Biru untuk Cuti.
- [x] Menyediakan fungsi khusus "Ajukan Cuti/Izin".
- [x] Otomatis menandai "Alpha" jika tidak absen pada hari kerja yang sudah lalu.

---

## 🔐 CODE STANDARDS

### Naming Convention
```typescript
// Variables & Functions: camelCase
const isWithinWorkingHours = true;
function formatTime(date: Date) { }

// Classes & Components: PascalCase
function CheckInButton() { }

// Constants: UPPER_SNAKE_CASE
const WORK_START_HOUR = 9;
const WORK_END_HOUR = 17;
```

### Performance Standards
- Zero console errors in browser.
- Lighthouse scores > 90 across all metrics.
- Animations utilize CSS transforms for 60fps performance.

---

## 🔄 WORKFLOW RULES
1. Maintain record of progress in `agent.md`.
2. Document all significant errors/roadblocks in `mistake.md`.
3. Auto-lint every commit.
