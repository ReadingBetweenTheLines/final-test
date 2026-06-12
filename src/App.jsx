import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

// --- KONFIGURASI TINGKATAN (STAGES) SESUAI KISI-KISI ---
const STAGE_CONFIG = {
  1: {
    title: "Tahap 1: Teknisi Perangkat Keras",
    allowedAssets: ['BINARY-NODE'],
    description: "Inisialisasi infrastruktur dasar! Aktifkan saklar memori menggunakan sistem angka biner (basis 2)."
  },
  2: {
    title: "Tahap 2: Konfigurator Antarmuka",
    allowedAssets: ['BASIC-IO'],
    description: "Atur saluran komunikasi sistem. Konfigurasikan perintah input, cetak teks, dan struktur percabangan logika."
  },
  3: {
    title: "Tahap 3: Pengembang Logika",
    allowedAssets: ['NUM-PATTERN'],
    description: "Optimalkan logika perulangan (looping). Tebak langkah suku berikutnya pada pola angka."
  },
  4: {
    title: "Tahap 4: Petugas Keamanan Siber",
    allowedAssets: ['CAESAR-CIPHER'],
    description: "Ancaman terdeteksi! Gunakan kunci pergeseran sandi untuk enkripsi dan dekripsi paket data rahasia."
  },
  5: {
    title: "Tahap 5: Inspektur Jaringan",
    allowedAssets: ['PARITY-GRID'],
    description: "Deteksi Jaringan Progresif! Klik langsung pada sel/kotak di dalam tabel grid yang menurutmu melanggar aturan Paritas Genap (Jumlah angka 1 GANJIL)!"
  },
  6: {
    title: "Tahap 6: Arsitek Sistem (CDO)",
    allowedAssets: ['INSERTION-SORT'],
    description: "Puncak Algoritma! Urutkan deretan blok angka di bawah menggunakan metode Sisip (Insertion Sort) dengan langkah seefisien mungkin!"
  }
};

// --- ENGINE GENERATOR MATRIKS PARITY 2D SEGIEMPAT PROGRESIF ---
function generateDynamicSquareParityGrid(questionIndex) {
  const gridSize = 4 + questionIndex;

  let matrix = [];
  for (let r = 0; r < gridSize; r++) {
    let row = [];
    for (let c = 0; c < gridSize; c++) {
      row.push(Math.random() > 0.5 ? 1 : 0);
    }
    matrix.push(row);
  }

  const errorType = Math.random() > 0.5 ? 'BARIS' : 'KOLOM';

  if (errorType === 'BARIS') {
    const targetRow = Math.floor(Math.random() * gridSize);

    for (let r = 0; r < gridSize; r++) {
      let onesCount = matrix[r].reduce((acc, val) => acc + val, 0);
      if (r === targetRow) {
        if (onesCount % 2 === 0) {
          matrix[r][0] = matrix[r][0] === 1 ? 0 : 1;
        }
      } else {
        if (onesCount % 2 !== 0) {
          matrix[r][0] = matrix[r][0] === 1 ? 0 : 1;
        }
      }
    }

    return {
      type: 'PARITY-GRID',
      errorType: 'BARIS',
      question: `Periksa baris horizontal secara teliti. Klik kotak pada baris (B1-B${gridSize}) yang bernilai GANJIL!`,
      errorIndex: targetRow,
      gridData: matrix,
      gridSize: gridSize
    };
  } else {
    const targetCol = Math.floor(Math.random() * gridSize);

    for (let c = 0; c < gridSize; c++) {
      let onesCount = 0;
      for (let r = 0; r < gridSize; r++) {
        onesCount += matrix[r][c];
      }

      if (c === targetCol) {
        if (onesCount % 2 === 0) {
          matrix[0][c] = matrix[0][c] === 1 ? 0 : 1;
        }
      } else {
        if (onesCount % 2 !== 0) {
          matrix[0][c] = matrix[0][c] === 1 ? 0 : 1;
        }
      }
    }

    return {
      type: 'PARITY-GRID',
      errorType: 'KOLOM',
      question: `Periksa kolom vertikal secara teliti. Klik kotak pada kolom (K1-K${gridSize}) yang bernilai GANJIL!`,
      errorIndex: targetCol,
      gridData: matrix,
      gridSize: gridSize
    };
  }
}

// --- GENERATOR UTAMA JALUR TRANSAKSI SOAL ---
function generateQuestion(stage, questionIndex = 0) {
  let type = STAGE_CONFIG[stage].allowedAssets[0];

  if (stage === 6) {
    type = 'INSERTION-SORT';
  }

  if (type === 'PARITY-GRID') {
    return generateDynamicSquareParityGrid(questionIndex);
  }

  if (type === 'BINARY-NODE') {
    if (questionIndex >= 0 && questionIndex <= 3) {
      if (questionIndex === 3) {
        return {
          type,
          mode: 'theory',
          question: `[KESULITAN 1 - SOAL 4] Jika 5 digit biner dari kanan ke kiri bernilai (1, 2, 4, 8, 16), berapakah nilai desimal untuk digit ke-6?`,
          answer: "32"
        };
      } else {
        const modes = ['decToBinSwitch', 'binToDecText'];
        const selectedMode = modes[Math.floor(Math.random() * modes.length)];
        const num = Math.floor(Math.random() * 22) + 10;

        if (selectedMode === 'decToBinSwitch') {
          return {
            type,
            mode: 'switch',
            question: `[KESULITAN 1 - SOAL ${questionIndex + 1}] Konfigurasikan saklar biner di bawah agar bernilai tepat [ ${num} ] angka desimal biasa!`,
            answer: num.toString(),
            targetNum: num
          };
        } else {
          const binStr = num.toString(2).padStart(5, '0');
          return {
            type,
            mode: 'text',
            question: `[KESULITAN 1 - SOAL ${questionIndex + 1}] Konversikan kode biner [ ${binStr} ] menjadi angka desimal biasa!`,
            answer: num.toString(),
            targetNum: num,
            targetBin: binStr
          };
        }
      }
    }

    if (questionIndex >= 4 && questionIndex <= 8) {
      const isMultiplication = Math.random() > 0.5;

      if (isMultiplication) {
        const safePairs = [
          { a: 3, b: 5 }, { a: 4, b: 4 }, { a: 2, b: 9 }, { a: 5, b: 5 },
          { a: 3, b: 7 }, { a: 4, b: 6 }, { a: 2, b: 12 }, { a: 3, b: 9 }
        ];
        const pair = safePairs[Math.floor(Math.random() * safePairs.length)];
        const binA = pair.a.toString(2).padStart(5, '0');
        const binB = pair.b.toString(2).padStart(5, '0');
        const finalResult = pair.a * pair.b;
        const binAnswer = finalResult.toString(2).padStart(5, '0');

        return {
          type,
          mode: 'text',
          question: `[KESULITAN 2 - SOAL ${questionIndex - 3}] Hitunglah hasil PERKALIAN biner berikut dan jawab dalam KODE BINER 5-DIGIT: [ ${binA} ] × [ ${binB} ] = ...`,
          answer: binAnswer,
          targetNum: finalResult
        };
      } else {
        const numA = Math.floor(Math.random() * 12) + 3;
        const numB = Math.floor(Math.random() * 12) + 3;
        const binA = numA.toString(2).padStart(5, '0');
        const binB = numB.toString(2).padStart(5, '0');
        const finalResult = numA + numB;
        const binAnswer = finalResult.toString(2).padStart(5, '0');

        return {
          type,
          mode: 'text',
          question: `[KESULITAN 2 - SOAL ${questionIndex - 3}] Hitunglah hasil PENJUMLAHAN biner berikut dan jawab dalam KODE BINER 5-DIGIT: [ ${binA} ] + [ ${binB} ] = ...`,
          answer: binAnswer,
          targetNum: finalResult
        };
      }
    }
    return null;
  }

  if (type === 'BASIC-IO') {
    const currentQuestionNum = questionIndex + 1;
    const varNames = ['perangkat', 'simpul', 'klien', 'muatan', 'paket', 'terminal', 'port'];
    const systems = ['UTAMA', 'TEPI', 'AKAR', 'HOST', 'TAUTAN', 'GERBANG', 'ZONA'];
    const alerts = ['AWAS', 'PERINGATAN', 'INFO', 'SINKRON', 'LOG', 'GAGAL', 'LULUS'];
    const responses = ['SUKSES', 'DIIZINKAN', 'DITOLAK', 'HABIS_WAKTU', 'ONLINE', 'OFFLINE'];

    const v1 = varNames[Math.floor(Math.random() * varNames.length)];
    const sys = systems[Math.floor(Math.random() * systems.length)];
    const alr = alerts[Math.floor(Math.random() * alerts.length)];

    const inputA = Math.random() > 0.5 ? 1 : 0;
    const inputB = Math.random() > 0.5 ? 1 : 0;
    const inputC = Math.random() > 0.5 ? 1 : 0;

    if (questionIndex === 0) {
      return {
        type,
        qNum: currentQuestionNum,
        question: `[SOAL ${currentQuestionNum} - ARSITEKTUR SISTEM] Sebuah skrip otomatisasi mendeteksi interaksi komponen baru pada pusat jaringan. Analisis alur penggabungan teks pada variabel memori di bawah ini. Tentukan hasil cetak teks yang akan muncul secara presisi!`,
        codeLines: [
          `1: teks_awal = "${alr}_"`,
          `2: id_${v1} = "${sys}"`,
          `3: teks_akhir = "_TERHUBUNG"`,
          `4: total_pesan = teks_awal + id_${v1} + teks_akhir`,
          `5: CETAK total_pesan`
        ],
        answer: `${alr}_${sys}_TERHUBUNG`
      };
    }
    else if (questionIndex === 1) {
      const baseNum = Math.floor(Math.random() * 6) + 4;
      const multiplier = Math.floor(Math.random() * 3) + 2;
      const adjuster = Math.floor(Math.random() * 4) + 1;
      const finalAns = (baseNum * multiplier) - (baseNum + adjuster);

      return {
        type,
        qNum: currentQuestionNum,
        question: `[SOAL ${currentQuestionNum} - PELACAKAN MEMORI] Lacak operasi hitung angka pada lokasi memori di bawah ini secara runut dari atas ke bawah. Berapakah angka akhir yang akan dicetak oleh sistem?`,
        codeLines: [
          `1: register_${v1.toUpperCase()} = ${baseNum}`,
          `2: muatan_sementara = register_${v1.toUpperCase()} * ${multiplier}`,
          `3: hasil_akhir = muatan_sementara - (register_${v1.toUpperCase()} + ${adjuster})`,
          `4: CETAK hasil_akhir`
        ],
        answer: finalAns.toString()
      };
    }
    else if (questionIndex === 2) {
      const limit = Math.floor(Math.random() * 4) * 10 + 60;
      const actualValue = Math.random() > 0.5 ? (limit + 15) : (limit - 15);
      const r1 = responses[Math.floor(Math.random() * 3)];
      const r2 = responses[Math.floor(Math.random() * 3) + 3];
      const finalAns = actualValue > limit ? r1 : r2;

      return {
        type,
        qNum: currentQuestionNum,
        question: `[SOAL ${currentQuestionNum} - ANALISIS LALU LINTAS] Perangkat jaringan mendeteksi perubahan data. Baca instruksi percabangan kondisi (JIKA-MAKA) di bawah ini. JIKA sistem menerima angka beban sebesar [ ${actualValue} ], tentukan teks status yang akan tercetak!`,
        codeLines: [
          `1: input_${v1} = ${actualValue}`,
          `2: batas_maksimal = ${limit}`,
          `3: JIKA input_${v1} > batas_maksimal MAKA`,
          `4:   laporan_status = "${r1}"`,
          `5: LAINNYA`,
          `6:   laporan_status = "${r2}"`,
          `7: AKHIR_JIKA`,
          `8: CETAK laporan_status`
        ],
        answer: finalAns
      };
    }
    else if (questionIndex === 3) {
      const initialScore = Math.random() > 0.5 ? 45 : 15;
      const triggerA = Math.floor(Math.random() * 5) + 8;
      const triggerB = Math.floor(Math.random() * 3) + 2;
      let scoreEvaluator = initialScore;
      if (scoreEvaluator > 20) scoreEvaluator += triggerA;
      if (scoreEvaluator > 40) scoreEvaluator *= triggerB;
      if (scoreEvaluator < 30) scoreEvaluator -= 5;

      return {
        type,
        qNum: currentQuestionNum,
        question: `[SOAL ${currentQuestionNum} - EVALUASI ANCAMAN SIBER] Sebuah paket data melewati 3 lapisan filter keamanan berturut-turut. Lacak perubahan nilai variabel secara berurutan dan disiplin untuk menemukan angka akhirnya!`,
        codeLines: [
          `1: skor_${v1} = ${initialScore}`,
          `2: JIKA skor_${v1} > 20 MAKA skor_${v1} = skor_${v1} + ${triggerA}`,
          `3: JIKA skor_${v1} > 40 MAKA skor_${v1} = skor_${v1} * ${triggerB}`,
          `4: JIKA skor_${v1} < 30 MAKA skor_${v1} = skor_${v1} - 5`,
          `5: CETAK skor_${v1}`
        ],
        answer: scoreEvaluator.toString()
      };
    }
    // 🌟 PERBAIKAN: Ganti questionIndex === 5 menjadi questionIndex === 4
    else if (questionIndex === 4) { 
      const g1Correct = (inputA === 1 && inputB === 1) ? 1 : 0;
      return {
        type,
        qNum: currentQuestionNum,
        mode: 'interactive-circuit',
        question: `[SOAL ${currentQuestionNum} - KABEL SERI] ...`,
        circuitType: 'LIGHT-AND',
        inputs: { A: inputA, B: inputB },
        correctGates: { G1: g1Correct }
      };
    }
    // 🌟 PERBAIKAN: Ganti questionIndex === 6 menjadi questionIndex === 5
    else if (questionIndex === 5) {
      const realA = inputA === 1 ? 0 : 1;
      const g1Correct = (realA === 1 && inputB === 1) ? 1 : 0;
      return {
        type,
        qNum: currentQuestionNum,
        mode: 'interactive-circuit',
        question: `[SOAL ${currentQuestionNum} - GERBANG TERBALIK] ...`,
        circuitType: 'LIGHT-INVERT-AND',
        inputs: { A: inputA, B: inputB },
        correctGates: { G1: g1Correct }
      };
    }
    // 🌟 PERBAIKAN: Ganti questionIndex === 7 menjadi questionIndex === 6
    else if (questionIndex === 6) {
      const jalurSeri = (inputA === 1 && inputB === 1) ? 1 : 0;
      const g1Correct = (jalurSeri === 1 || inputC === 1) ? 1 : 0;
      return {
        type,
        qNum: currentQuestionNum,
        mode: 'interactive-circuit',
        question: `[SOAL ${currentQuestionNum} - PERCABANGAN GANDA] ...`,
        circuitType: 'LIGHT-MIX-3WAY',
        inputs: { A: inputA, B: inputB, C: inputC },
        correctGates: { G1: g1Correct }
      };
    }
    // 🌟 PERBAIKAN: Ganti questionIndex === 8 menjadi questionIndex === 7
    else if (questionIndex === 7) {
      const realA = inputA === 1 ? 0 : 1;
      const realC = inputC === 1 ? 0 : 1;
      const jalurSeri = (realA === 1 && inputB === 1) ? 1 : 0;
      const g1Correct = (jalurSeri === 1 || realC === 1) ? 1 : 0;
      return {
        type,
        qNum: currentQuestionNum,
        mode: 'interactive-circuit',
        question: `[SOAL ${currentQuestionNum} - DOUBLE INVERSI] ...`,
        circuitType: 'LIGHT-INVERT-MIX',
        inputs: { A: inputA, B: inputB, C: inputC },
        correctGates: { G1: g1Correct }
      };
    }
    // 🌟 PERBAIKAN: Ganti questionIndex === 9 menjadi questionIndex === 8
    else if (questionIndex === 8) {
      const inputD = Math.random() > 0.5 ? 1 : 0;
      const jalurAtas = (inputA === 1 && inputB === 1) ? 1 : 0;
      const jalurBawah = (inputC === 1 && inputD === 1) ? 1 : 0;
      const g1Correct = (jalurAtas === 1 || jalurBawah === 1) ? 1 : 0;
      return {
        type,
        qNum: currentQuestionNum,
        mode: 'interactive-circuit',
        question: `[SOAL ${currentQuestionNum} - FILTRASI MATRIKS 4 SAKLAR] ...`,
        circuitType: 'LIGHT-FINAL-BOSS-4WAY',
        inputs: { A: inputA, B: inputB, C: inputC, D: inputD },
        correctGates: { G1: g1Correct }
      };
    }
    // 🌟 PERBAIKAN: Tambahkan indeks 9 untuk melengkapi total paket 10 soal
    else if (questionIndex === 9) {
      const g1Correct = inputC === 1 ? 1 : 0;
      return {
        type,
        qNum: currentQuestionNum,
        mode: 'interactive-circuit',
        question: `[SOAL ${currentQuestionNum} - KENDALI INDUK] 
Aturan Aliran: Jalur saklar bypass langsung menuju lampu utama.

Cara Menebak Status Lampu:
1. Cukup perhatikan nilai dari Saklar C di bawah.
2. Jika Saklar C bernilai 1, aliran listrik langsung lolos menuju lampu utama tanpa hambatan cabang lain.

Gunakan logika bypass ini untuk menentukan jawaban akhir!`,
        circuitType: 'LIGHT-AND', // Menggunakan template dasar yang sudah ada
        inputs: { A: inputA, B: inputB, C: inputC },
        correctGates: { G1: g1Correct }
      };
    }
  }

  if (type === 'NUM-PATTERN') {
    const currentQuestionNum = questionIndex + 1;
    let textQuestion = "";
    let correctAnswer = "";

    if (questionIndex === 0) {
      const start = Math.floor(Math.random() * 20) + 5;
      const step = Math.floor(Math.random() * 5) + 3;
      const n1 = start, n2 = n1 + step, n3 = n2 + step, n4 = n3 + step;
      textQuestion = `[SOAL 1 - NAIK LINEAR] Optimasi kecepatan data! Tentukan angka berikutnya pada pola penambahan tetap ini: ${n1}, ${n2}, ${n3}, ${n4}, ___`;
      correctAnswer = (n4 + step).toString();
    }
    else if (questionIndex === 1) {
      const start = Math.floor(Math.random() * 4) + 2;
      const n1 = start, n2 = n1 * 2, n3 = n2 * 2, n4 = n3 * 2;
      textQuestion = `[SOAL 2 - DERET GEOMETRI] Penggandaan beban memori! Analisis faktor kelipatan tetap untuk menentukan muatan berikutnya: ${n1}, ${n2}, ${n3}, ${n4}, ___`;
      correctAnswer = (n4 * 2).toString();
    }
    else if (questionIndex === 2) {
      const start = Math.floor(Math.random() * 30) + 60;
      const step = Math.floor(Math.random() * 4) + 5;
      const n1 = start, n2 = n1 - step, n3 = n2 - step, n4 = n3 - step;
      textQuestion = `[SOAL 3 - TURUN LINEAR] Pelepasan ruang penyimpanan! Analisis pengurangan tetap secara mundur untuk menebak angka berikutnya: ${n1}, ${n2}, ${n3}, ${n4}, ___`;
      correctAnswer = (n4 - step).toString();
    }
    else if (questionIndex === 3) {
      const start = Math.floor(Math.random() * 20) + 10;
      const up = Math.floor(Math.random() * 3) + 4;
      const down = Math.floor(Math.random() * 2) + 2;
      const n1 = start, n2 = n1 + up, n3 = n2 - down, n4 = n3 + up, n5 = n4 - down;
      textQuestion = `[SOAL 4 - POLA SELANG-SELING] Sistem mendeteksi dua perintah perhitungan (+ / -) yang berjalan bergantian! Tebak angka selanjutnya: ${n1}, ${n2}, ${n3}, ${n4}, ${n5}, ___`;
      correctAnswer = (n5 + up).toString();
    }
    else if (questionIndex === 4) {
      const start = Math.floor(Math.random() * 4) + 2;
      const isPlus = Math.random() > 0.5;
      const adjust = isPlus ? 1 : -1;
      const n1 = start, n2 = (n1 * 2) + adjust, n3 = (n2 * 2) + adjust, n4 = (n3 * 2) + adjust;
      const hintText = isPlus ? "dikali 2 lalu ditambah 1" : "dikali 2 lalu dikurangi 1";
      textQuestion = `[SOAL 5 - UJIAN BOSS: GANDAKAN DAN SESUAIKAN] Titik perulangan akhir! Setiap blok mematuhi aturan berantai [ ${hintText} ]. Tentukan isi angka pada blok ujung: ${n1}, ${n2}, ${n3}, ${n4}, ___`;
      correctAnswer = ((n4 * 2) + adjust).toString();
    }

    return { type, qNum: currentQuestionNum, question: textQuestion, answer: correctAnswer };
  }

  if (type === 'CAESAR-CIPHER') {
    const currentQuestionNum = questionIndex + 1;
    const logicIndex = Math.floor(questionIndex / 2);
    let textQuestion = "";
    let correctAnswer = "";

    const prefixPool = ['AMAN', 'AKSES', 'SIBER', 'SERVER', 'PAKET', 'FIREWALL'];
    const suffixPool = ['INTI', 'ALIRAN', 'ONLINE', 'REBOOT', 'PROKSI', 'SINYAL'];
    const phrase = `${prefixPool[Math.floor(Math.random() * prefixPool.length)]}_${suffixPool[Math.floor(Math.random() * suffixPool.length)]}`;

    if (logicIndex === 0) {
      const shift = Math.floor(Math.random() * 4) + 3;
      correctAnswer = phrase.split('').map(char => char.charCodeAt(0) >= 65 && char.charCodeAt(0) <= 90 ? String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65) : char).join('');
      textQuestion = `[SOAL ${currentQuestionNum} - ENKRIPSI CAESAR] Kunci teks frasa jaringan "${phrase}" dengan menggeser abjadnya MAJU sebanyak (+${shift} langkah).`;
    }
    else if (logicIndex === 1) {
      const shift = Math.floor(Math.random() * 4) + 3;
      const encrypted = phrase.split('').map(char => char.charCodeAt(0) >= 65 && char.charCodeAt(0) <= 90 ? String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65) : char).join('');
      correctAnswer = phrase;
      textQuestion = `[SOAL ${currentQuestionNum} - DEKRIPSI CAESAR] Pecahkan kode sandi "${encrypted}" dengan memutar karakter abjad MUNDUR sebanyak (-${shift} langkah).`;
    }
    else if (logicIndex === 2) {
      correctAnswer = phrase.split('').map(char => char.charCodeAt(0) >= 65 && char.charCodeAt(0) <= 90 ? String.fromCharCode(90 - (char.charCodeAt(0) - 65)) : char).join('');
      textQuestion = `[SOAL ${currentQuestionNum} - SANDI ATBASH] Ubah teks frasa "${phrase}" menggunakan Sandi Cermin Atbash (Aturan: A=Z, B=Y, C=X s.d Z=A).`;
    }
    else if (logicIndex === 3) {
      const qwerty = "QWERTYUIOPASDFGHJKLZXCVBNMQ";
      correctAnswer = phrase.split('').map(char => { const idx = qwerty.indexOf(char); return idx !== -1 ? qwerty[idx + 1] : char; }).join('');
      textQuestion = `[SOAL ${currentQuestionNum} - GESER KEYBOARD] Sandikan teks frasa "${phrase}" dengan mengganti setiap huruf menggunakan HURUF DI SEBELAH KANANNYA pada keyboard QWERTY!`;
    }
    else if (logicIndex === 4) {
      let r1 = "", r2 = "";
      phrase.split('').forEach((char, idx) => { if (idx % 2 === 0) r1 += char; else r2 += char; });
      const encryptedRail = r1 + r2;
      correctAnswer = phrase;
      textQuestion = `[SOAL ${currentQuestionNum} - UJIAN BOSS: SANDI ZIGZAG] Pecahkan kode rahasia "${encryptedRail}" hasil penggabungan karakter di posisi ganjil dan genap menjadi teks frasa asli!`;
    }

    return { type, qNum: currentQuestionNum, question: textQuestion, answer: correctAnswer };
  }

  if (type === 'INSERTION-SORT') {
    const blockCounts = [15, 15, 18, 18, 20];
    const gridSize = blockCounts[questionIndex] || 15;
    const currentQuestionNum = questionIndex + 1;

    let scrambled = [];
    let textQuestion = "";

    if (questionIndex === 2) {
      const letters = ['A', 'B', 'C'];
      let pool = [];
      letters.forEach(l => {
        for (let n = 1; n <= 9; n++) pool.push(`${l}${n}`);
      });
      while (scrambled.length < gridSize) {
        const randIdx = Math.floor(Math.random() * pool.length);
        const code = pool.splice(randIdx, 1)[0];
        if (!scrambled.includes(code)) scrambled.push(code);
      }
      textQuestion = `[SOAL 3 - KODE ALFANUMERIK] Seret dan susun 18 blok rak penyimpan data di bawah berdasarkan abjad HURUF terlebih dahulu (A s.d C), lalu diikuti URUTAN ANGKA di belakangnya (Contoh: A1, A2, B1, B2)!`;
    }
    else {
      while (scrambled.length < gridSize) {
        const randomValue = Math.floor(Math.random() * 90) + 10;
        if (!scrambled.includes(randomValue)) scrambled.push(randomValue);
      }

      if (questionIndex === 0) {
        textQuestion = `[SOAL 1 - NAIK LINEAR] Pemanasan struktur data! Seret dan urutkan 15 blok data di bawah murni dari nilai TERKECIL ke TERBESAR!`;
      } else if (questionIndex === 1) {
        textQuestion = `[SOAL 2 - PARTISI PARITAS] Saring karakteristik angka! Kumpulkan semua blok angka GANJIL di sisi kiri (urut dari kecil ke besar), lalu kumpulkan semua blok angka GENAP di sisi kanan (urut dari kecil ke besar)!`;
      } else if (questionIndex === 3) {
        textQuestion = `[SOAL 4 - PIRAMIDA SIMETRIS] Bentuk Formasi Gunung! Urutkan 18 blok data agar membentuk cermin simetris: Sisi Kiri mengurut NAIK, Sisi Kanan mengurut TURUN, dan bertemu di tengah tepat pada angka TERBESAR!`;
      } else if (questionIndex === 4) {
        textQuestion = `[SOAL 5 - UJIAN BOSS: FILTER SATUAN] Ujian Akhir Arsitektur! Lihat hanya pada angka SATUAN (angka paling belakang). Tempatkan blok berakhiran [0-4] di sisi kiri (urut dari kecil ke besar), dan blok berakhiran [5-9] di sisi kanan (urut dari kecil ke besar)!`;
      }
    }

    const maxEffectiveMoves = gridSize + (questionIndex * 5);

    return {
      type: 'INSERTION-SORT',
      qNum: currentQuestionNum,
      question: textQuestion,
      initialArray: [...scrambled],
      maxEffectiveMoves: maxEffectiveMoves
    };
  }
  return null;
}

export default function App() {
  const [currentStage, setCurrentStage] = useState(() => {
    return Number(localStorage.getItem('tycoon_tahap_sekarang') || '1');
  });
  const [questionsAnsweredInStage, setQuestionsAnsweredInStage] = useState(0); 
  
  // 🌟 STATE BARU: Menyimpan seluruh paket soal dan paket jawaban dalam satu Tahap
  const [stageQuestions, setStageQuestions] = useState([]);
  const [stageAnswers, setStageAnswers] = useState({}); 
  
  const [currentArrayData, setCurrentArrayData] = useState([]);
  const [studentMoves, setStudentMoves] = useState(0);
  const [draggedOverIdx, setDraggedOverIdx] = useState(null);
  
  const [score, setScore] = useState(0);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [feedback, setFeedback] = useState({ type: '', msg: '' });
  const [isExamComplete, setIsExamComplete] = useState(false);

  // live streaming seluruh siswa untuk Panel Guru
  const [liveStudentsData, setLiveStudentsData] = useState([]);


  // ✅ PERBAIKAN STATE: Mengunci penampung teks login siswa agar tidak memicu 'no-undef'
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('tycoon_nama_siswa');
  });
  const [studentName, setStudentName] = useState(() => localStorage.getItem('tycoon_nama_siswa') || '');
  const [studentClass, setStudentClass] = useState(() => localStorage.getItem('tycoon_kelas_siswa') || '');
  const [inputToken, setInputToken] = useState(() => localStorage.getItem('tycoon_token_aktif') || '');
  const [isLoading, setIsLoading] = useState(false);

  // State pengontrol kemunculan jendela pop-up konfirmasi perpindahan babak
  const [showStageConfirmPopup, setShowStageConfirmPopup] = useState(false);

  const logEvent = () => { };

  // 🌟 ENGINE LOCK SOAL & JAWABAN: Menjamin variasi soal dan jawaban selalu sinkron dari cloud
  const initStageQuestions = async (stage) => {
    // 1. Coba ambil dari localStorage seperti biasa (paling cepat)
    const savedPack = localStorage.getItem(`tycoon_pack_stage_${stage}`);
    
    if (savedPack) {
      const parsedPack = JSON.parse(savedPack);
      setStageQuestions(parsedPack);
      
      const savedAnswers = localStorage.getItem(`tycoon_answers_stage_${stage}`);
      if (savedAnswers) {
        // Pulihkan sub-objek jawaban tahap ini ke dalam induk state global
        setStageAnswers(prev => ({ ...prev, [`stage_${stage}`]: JSON.parse(savedAnswers) }));
      }

      // === DI DALAM BAGIAN 1 (LOKAL): Pemulihan khusus Tahap 6 ===
    if (stage === 6) {
      const savedArray = localStorage.getItem('tycoon_array_terakhir');
      if (savedArray) {
        setCurrentArrayData(JSON.parse(savedArray));
      } else if (parsedPack[questionsAnsweredInStage]?.savedProgressArray) {
        // 🌟 KOREKSI: Gunakan progres simpanan nomor berjalan jika local_storage hilang sebagian
        setCurrentArrayData([...parsedPack[questionsAnsweredInStage].savedProgressArray]);
      } else if (parsedPack[questionsAnsweredInStage]?.initialArray) {
        setCurrentArrayData([...parsedPack[questionsAnsweredInStage].initialArray]);
      }
      setStudentMoves(Number(localStorage.getItem('tycoon_moves_terakhir') || '0'));
    }
      return; 
    }

    // 2. Jika localStorage kosong (efek clear/refresh ekstrem), ketuk database cloud Supabase!
    try {
      const tokenAktif = localStorage.getItem('tycoon_token_aktif') || inputToken;
      const namaAktif = localStorage.getItem('tycoon_nama_siswa') || studentName;

      if (tokenAktif && namaAktif) {
        const { data: dataSiswa } = await supabase
          .from('token_ujian')
          .select('soal_live, jawaban_live')
          .eq('kode_token', tokenAktif.trim().toUpperCase())
          .eq('nama_siswa', namaAktif.trim().toUpperCase())
          .maybeSingle();

        if (dataSiswa && dataSiswa.soal_live && dataSiswa.soal_live[`stage_${stage}`]) {
          const cloudPack = dataSiswa.soal_live[`stage_${stage}`];
          const qIdx = questionsAnsweredInStage;
          
          setStageQuestions(cloudPack);
          localStorage.setItem(`tycoon_pack_stage_${stage}`, JSON.stringify(cloudPack));
          
          if (dataSiswa.jawaban_live) {
            setStageAnswers(dataSiswa.jawaban_live);
            const targetStageAnswers = dataSiswa.jawaban_live[`stage_${stage}`] || {};
            localStorage.setItem(`tycoon_answers_stage_${stage}`, JSON.stringify(targetStageAnswers));
          }

          if (stage === 6 && cloudPack[qIdx]) {
            // 🌟 KOREKSI UTAMA: Cek apakah siswa sudah mencicil menyortir blok di cloud
            const progressArr = cloudPack[qIdx].savedProgressArray;
            const initialArr = cloudPack[qIdx].initialArray;
            
            const arrayFinal = progressArr ? progressArr : initialArr;
            setCurrentArrayData([...arrayFinal]);
            localStorage.setItem('tycoon_array_terakhir', JSON.stringify(arrayFinal));
            
            // Tarik jumlah langkah terakhir dari memori pembantu
            // (Opsional: Bisa ditambahkan ke objek jika ingin mengunci jumlah langkah super ketat)
          }
          return; 
        }
      }
    } catch (err) {
      console.error("Gagal memulihkan paket soal dari cloud:", err);
    }

    // 3. Jika di cloud & lokal belum ada data (Benar-benar baru pertama kali klik login)
    let maxQuestions = 5;
    if (stage === 1) maxQuestions = 9;
    else if (stage === 2 || stage === 4) maxQuestions = 10;

    const lockedPack = [];
    for (let i = 0; i < maxQuestions; i++) {
      lockedPack.push(generateQuestion(stage, i));
    }
    
    // Simpan di memori lokal HP siswa
    localStorage.setItem(`tycoon_pack_stage_${stage}`, JSON.stringify(lockedPack));
    setStageQuestions(lockedPack);

    // 🌟 SINKRONKAN DATA SOAL KE SUPABASE: Kunci mati agar tidak berubah selamanya
    try {
      const tokenAktif = localStorage.getItem('tycoon_token_aktif') || inputToken;
      const namaAktif = localStorage.getItem('tycoon_nama_siswa') || studentName;

      if (tokenAktif && namaAktif) {
        // Tarik data soal_live yang sudah ada saat ini agar tidak menghapus soal dari tahap lain
        const { data: currentData } = await supabase
          .from('token_ujian')
          .select('soal_live')
          .eq('kode_token', tokenAktif.trim().toUpperCase())
          .eq('nama_siswa', namaAktif.trim().toUpperCase())
          .maybeSingle();

        const currentSoalLive = currentData?.soal_live || {};
        currentSoalLive[`stage_${stage}`] = lockedPack; // Masukkan paket soal tahap ini

        await supabase
          .from('token_ujian')
          .update({ soal_live: currentSoalLive })
          .eq('kode_token', tokenAktif.trim().toUpperCase())
          .eq('nama_siswa', namaAktif.trim().toUpperCase());
      }
    } catch (err) {
      console.error("Gagal mengunci paket soal ke database server:", err);
    }

    if (stage === 6 && lockedPack[0]?.initialArray) {
      setCurrentArrayData([...lockedPack[0].initialArray]);
      localStorage.setItem('tycoon_array_terakhir', JSON.stringify(lockedPack[0].initialArray));
      setStudentMoves(0);
      localStorage.setItem('tycoon_moves_terakhir', '0');
    }
  };

  // 🌟 POINTER DINAMIS: Menjaga kompatibilitas kodingan visual lamamu
  const activeQuestion = stageQuestions[questionsAnsweredInStage] || null;
  // Membaca jawaban spesifik tahap dan nomor berjalan
  const currentStageAnswers = stageAnswers[`stage_${currentStage}`] || {};
  const playerAnswer = currentStageAnswers[questionsAnsweredInStage] || '';

  // 🌟 SINKRONISASI CLOUD TERISOLASI: Menyimpan teks jawaban tanpa menimpa tahap lain
  const setPlayerAnswer = (teks) => {
    setStageAnswers(prev => {
      const stageKey = `stage_${currentStage}`;
      const currentStageAnswers = prev[stageKey] || {};
      
      const updatedStageAnswers = { ...currentStageAnswers, [questionsAnsweredInStage]: teks };
      const updated = { ...prev, [stageKey]: updatedStageAnswers };
      
      localStorage.setItem(`tycoon_answers_stage_${currentStage}`, JSON.stringify(updatedStageAnswers));
      
      // Kirim lembar jawaban terstruktur penuh ke Supabase
      supabase
        .from('token_ujian')
        .update({ jawaban_live: updated })
        .eq('kode_token', inputToken.trim().toUpperCase())
        .eq('nama_siswa', studentName.trim().toUpperCase())
        .then();

      return updated;
    });
  };

  const checkAnswer = () => {
    navigasiKeSoal(1);
  };

  // ✅ VARIABEL PEMBACA: Membaca memori saklar biner khusus tahap berjalan
  const binarySwitches = (stageAnswers[`stage_${currentStage}`] || {})[`switch_${questionsAnsweredInStage}`] || [0, 0, 0, 0, 0];

  const setBinarySwitches = (valOrFn) => {
    setStageAnswers(prev => {
      const stageKey = `stage_${currentStage}`;
      const currentStageAnswers = prev[stageKey] || {};
      const currentVal = currentStageAnswers[`switch_${questionsAnsweredInStage}`] || [0, 0, 0, 0, 0];
      const newVal = typeof valOrFn === 'function' ? valOrFn(currentVal) : valOrFn;
      
      const updatedStageAnswers = { ...currentStageAnswers, [`switch_${questionsAnsweredInStage}`]: newVal };
      const updated = { ...prev, [stageKey]: updatedStageAnswers };
      
      localStorage.setItem(`tycoon_answers_stage_${currentStage}`, JSON.stringify(updatedStageAnswers));
      
      supabase
        .from('token_ujian')
        .update({ jawaban_live: updated })
        .eq('kode_token', inputToken.trim().toUpperCase())
        .eq('nama_siswa', studentName.trim().toUpperCase())
        .then();

      return updated;
    });
  };

  // ✅ VARIABEL PEMBACA: Membaca memori sirkuit khusus tahap berjalan
  const circuitGates = (stageAnswers[`stage_${currentStage}`] || {})[`circuit_${questionsAnsweredInStage}`] || { G1: null };

  const setCircuitGates = (valOrFn) => {
    setStageAnswers(prev => {
      const stageKey = `stage_${currentStage}`;
      const currentStageAnswers = prev[stageKey] || {};
      const currentVal = currentStageAnswers[`circuit_${questionsAnsweredInStage}`] || { G1: null, G2: null, G3: null };
      const newVal = typeof valOrFn === 'function' ? valOrFn(currentVal) : valOrFn;
      
      const updatedStageAnswers = { ...currentStageAnswers, [`circuit_${questionsAnsweredInStage}`]: newVal };
      const updated = { ...prev, [stageKey]: updatedStageAnswers };
      
      localStorage.setItem(`tycoon_answers_stage_${currentStage}`, JSON.stringify(updatedStageAnswers));
      
      supabase
        .from('token_ujian')
        .update({ jawaban_live: updated })
        .eq('kode_token', inputToken.trim().toUpperCase())
        .eq('nama_siswa', studentName.trim().toUpperCase())
        .then();

      return updated;
    });
  };

  // =========================================================================
  // 🤖 🌟 REKATKAN KODE LANGKAH 1 (FUNGSI BOT SIMULATOR) DI SINI!
  // =========================================================================
  // 🤖 STATE SIMULATOR: Memantau apakah mesin robot sedang berjalan atau tidak
  const [isSimulating, setIsSimulating] = useState(false);

  const jalankanSimulasiBots = () => {
    if (liveStudentsData.length === 0) {
      alert("❌ Belum ada data siswa di tabel. Pastikan data siswa sudah ter-load dari Supabase!");
      return;
    }

    setIsSimulating(true);
    alert("🤖 ATURAN BARU AKTIF: 165 bot dipaksa tuntas massal tanpa refresh! Target nilai dikunci ketat antara 75% s.d 92% (TIDAK ADA NILAI 100%).");

    let daftarSiswaBot = [...liveStudentsData];

    const intervalSimulasi = setInterval(() => {
      // Mencari siapa saja siswa yang statusnya belum SELESAI
      const sisaSiswa = daftarSiswaBot.filter(s => !s.sudah_ujian);
      
      // Jika semua nama (165 orang) sudah menyelesaikan ujian, matikan bot otomatis
      if (sisaSiswa.length === 0) {
        clearInterval(intervalSimulasi);
        setIsSimulating(false);
        alert("🎉 SIMULASI SELESAI TOTAL! Semua nama di tabel telah menyelesaikan ujian dengan rentang nilai 75-92.");
        return;
      }

      // Supaya pergerakan di layar terlihat alami, gerakkan 2 sampai 5 siswa secara acak tiap 2 detik
      const jumlahSiswaBergerak = Math.min(Math.floor(Math.random() * 4) + 2, sisaSiswa.length);

      for (let i = 0; i < jumlahSiswaBergerak; i++) {
        const siswaAcak = sisaSiswa[Math.floor(Math.random() * sisaSiswa.length)];
        const idx = daftarSiswaBot.findIndex(s => s.nama_siswa === siswaAcak.nama_siswa && s.kode_token === siswaAcak.kode_token);

        if (idx === -1) continue;

        // 🔒 KUNCI NILAI MUTLAK: Tentukan target nilai akhir antara 75 sampai 92 sejak awal bot bergerak
        if (!daftarSiswaBot[idx].target_nilai_bot) {
          daftarSiswaBot[idx].target_nilai_bot = Math.floor(Math.random() * (92 - 75 + 1)) + 75; 
        }
        
        const targetNilai = daftarSiswaBot[idx].target_nilai_bot;
        // Konversi persentase ke jumlah skor mentah dari total 44 pertanyaan (Berkisar antara 33 s.d 40 benar)
        const targetSkorBenar = Math.round((targetNilai / 100) * 44);

        let jawabanLama = daftarSiswaBot[idx].jawaban_live || {};
        let skorLama = daftarSiswaBot[idx].skor_benar || 0;

        const stageAcak = Math.floor(Math.random() * 6) + 1;
        const stageKey = `stage_${stageAcak}`;
        
        if (!jawabanLama[stageKey]) jawabanLama[stageKey] = {};
        const jumlahSoalTerisi = Object.keys(jawabanLama[stageKey]).length;

        let statusSelesaiBot = false;
        
        // Alur pergerakan progres: naikkan skor bertahap sampai menyentuh batas target skornya
        if (skorLama >= targetSkorBenar || (jumlahSoalTerisi >= 5 && Math.random() > 0.5)) {
          statusSelesaiBot = true; // Paksa status mengunci ke SELESAI
          skorLama = targetSkorBenar; // Pastikan skor akhir mendarat tepat pada target
        } else {
          jawabanLama[stageKey][jumlahSoalTerisi] = `BOT_VAL_${Math.floor(Math.random() * 90) + 10}`;
          skorLama = Math.min(targetSkorBenar, skorLama + Math.floor(Math.random() * 4) + 1);
        }

        const nilaiAkhirBot = Math.round((skorLama / 44) * 100);

        // Rekam progres bot ke dalam array memori lokal laptop
        daftarSiswaBot[idx].jawaban_live = jawabanLama;
        daftarSiswaBot[idx].skor_benar = skorLama;
        daftarSiswaBot[idx].nilai_akhir = nilaiAkhirBot;
        if (statusSelesaiBot) daftarSiswaBot[idx].sudah_ujian = true;

        // Tembakkan langsung update perubahan ini ke database pusat Supabase secara real-time
        supabase
          .from('token_ujian')
          .update({
            jawaban_live: jawabanLama,
            skor_benar: skorLama,
            nilai_akhir: nilaiAkhirBot,
            sudah_ujian: statusSelesaiBot
          })
          .eq('kode_token', siswaAcak.kode_token)
          .eq('nama_siswa', siswaAcak.nama_siswa)
          .then();
      }
    }, 2000); // Sinkronisasi berjalan konstan setiap 2 detik
  };
  // =========================================================================

  // ✅ Membungkus fungsi dengan setTimeout untuk menghindari cascading renders
  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        initStageQuestions(currentStage);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, currentStage]);

  // 🌟 CODE UPDATE: Jalur pipa Websocket Realtime untuk Monitor Laptop Guru
  useEffect(() => {
    // Jalankan pemantauan HANYA jika Anda login sebagai GURU-MASTER (Stage 999)
    if (isAuthenticated && currentStage === 999) {
      
      // A. Ambil potret data awal seluruh siswa saat guru baru membuka halaman
      const ambilDataAwal = async () => {
        const { data } = await supabase
          .from('token_ujian')
          .select('*')
          .order('kelas', { ascending: true })
          .order('nama_siswa', { ascending: true });
        if (data) setLiveStudentsData(data);
      };
      ambilDataAwal();

      // B. Buka koneksi live stream ke server Supabase
      const saluranRealtime = supabase
        .channel('pantau-ujian-masal')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'token_ujian' },
          (payload) => {
            // Jika ada siswa baru login (INSERT) atau sedang mengirim skor (UPDATE)
            setLiveStudentsData((dataLama) => {
              const dataBaru = payload.new;
              
              // Cari tahu apakah data siswa ini sudah terdaftar di list layar laptop guru
              const indexSiswa = dataLama.findIndex((s) => s.kode_token === dataBaru.kode_token && s.nama_siswa === dataBaru.nama_siswa);
              
              if (indexSiswa !== -1) {
                // Perbarui baris skor mereka secara instan di layar tanpa kedip refresh!
                const updatedList = [...dataLama];
                updatedList[indexSiswa] = dataBaru;
                return updatedList;
              } else {
                // Tambahkan siswa baru yang baru saja memulai login ujian
                return [...dataLama, dataBaru];
              }
            });
          }
        )
        .subscribe();

      // Putus koneksi stream otomatis jika guru keluar atau log out dari panel
      return () => {
        supabase.removeChannel(saluranRealtime);
      };
    }
  }, [isAuthenticated, currentStage]);  

  const handleLoginUjian = async () => {
    if (!studentName.trim()) {
      setFeedback({ type: 'error', msg: 'NAMA PANGGILAN/LENGKAP WAJIB DIISI!' });
      return;
    }
    if (!inputToken.trim()) {
      setFeedback({ type: 'error', msg: 'KODE TOKEN UJIAN WAJIB DIISI!' });
      return;
    }

    setIsLoading(true);
    setFeedback({ type: '', msg: '' });

    try {
      const { data: dataSiswa, error } = await supabase
        .from('token_ujian')
        .select('*')
        .eq('kode_token', inputToken.trim().toUpperCase())  
        .eq('nama_siswa', studentName.trim().toUpperCase())
        .maybeSingle();

      if (error) throw error;

      if (!dataSiswa) {
        setFeedback({ type: 'error', msg: 'KODE TOKEN ATAU NAMA LENGKAP SALAH / TIDAK TERDAFTAR DI KELAS INI!' });
        setIsLoading(false);
        return;
      }

      if (dataSiswa.sudah_ujian) {
        setFeedback({ type: 'error', msg: '❌ KODE TOKEN INI SUDAH HANGUS! ANDA TIDAK BISA MENGIKUTI UJIAN KEMBALI.' });
        setIsLoading(false);
        return;
      }

      setStudentClass(dataSiswa.kelas);
      setIsAuthenticated(true);

      localStorage.setItem('tycoon_token_aktif', inputToken.trim().toUpperCase());
      localStorage.setItem('tycoon_nama_siswa', studentName.trim().toUpperCase());
      localStorage.setItem('tycoon_kelas_siswa', dataSiswa.kelas);

      // 🌟 KOREKSI URUTAN: Ambil variabel savedStage LEBIH DULU agar bisa dibaca di bawahnya
      const savedStage = localStorage.getItem('tycoon_tahap_sekarang');
      const startStage = savedStage ? parseInt(savedStage, 10) : 1;

      setCurrentStage(startStage);
      setQuestionsAnsweredInStage(0);
      initStageQuestions(startStage);
      
      setFeedback({ type: 'success', msg: 'Akses ujian berhasil dibuka! Semoga sukses.' });

    } catch (err) {
      console.error('Kendala koneksi otentikasi:', err);
      setFeedback({ type: 'error', msg: 'Gagal menghubungi server. Periksa jaringan internet HP!' });
    } finally {
      setIsLoading(false);
    }
  };

  const unduhRekapNilaiExcel = async () => {
    try {
      const { data, error } = await supabase
        .from('token_ujian')
        .select('nama_siswa, kelas, kode_token, sudah_ujian, skor_benar, nilai_akhir')
        .order('kelas', { ascending: true })
        .order('nama_siswa', { ascending: true });

      if (error || !data) {
        alert("Gagal menarik data dari server cloud Supabase.");
        return;
      }

      let kontenCSV = "No;Nama Siswa;Kelas;Kode Token;Status Ujian;Skor Benar (Mentah);Nilai Rapor (1-100)\n";

      data.forEach((siswa, indeks) => {
        const statusText = siswa.sudah_ujian ? "SELESAI" : "BELUM/SEDANG UJIAN";
        const skorText = `${siswa.skor_benar} / 44`;
        kontenCSV += `${indeks + 1};${siswa.nama_siswa};${siswa.kelas};${siswa.kode_token};${statusText};${skorText};${siswa.nilai_akhir}\n`;
      });

      const blobData = new Blob([kontenCSV], { type: 'text/csv;charset=utf-8;' });
      const urlUnduh = URL.createObjectURL(blobData);
      const linkPemicu = document.createElement("a");

      linkPemicu.setAttribute("href", urlUnduh);
      linkPemicu.setAttribute("download", `REKAP_NILAI_ALGORITHM_TYCOON_${studentClass || 'VII'}.csv`);
      linkPemicu.style.visibility = 'hidden';
      document.body.appendChild(linkPemicu);
      linkPemicu.click();
      document.body.removeChild(linkPemicu);

    } catch (err) {
      console.error("Gagal mengunduh laporan:", err);
    }
  };

  const checkTokenUntukAksesGuru = (teksInput) => {
    setInputToken(teksInput);
    if (teksInput.trim().toUpperCase() === 'GURU-MASTER') {
      setIsAuthenticated(true);
      setCurrentStage(999);
      logEvent("Sistem: Otorisasi Admin Berhasil. Membuka panel rekapitulasi nilai utama.");
    }
  };

  // 🌟 NAVIGASI: Pindah nomor tanpa validasi instan (Mendukung pemeriksaan ulang)
  const navigasiKeSoal = (arah) => {
    let maxQuestions = 5;
    if (currentStage === 1) maxQuestions = 9;
    else if (currentStage === 2 || currentStage === 4) maxQuestions = 10;

    const indeksBaru = questionsAnsweredInStage + arah;

    if (indeksBaru >= 0 && indeksBaru < maxQuestions) {
      setQuestionsAnsweredInStage(indeksBaru);
      setFeedback({ type: '', msg: '' });

      // Sinkronisasi data array jika berada di Tahap 6
      if (currentStage === 6 && stageQuestions[indeksBaru]?.initialArray) {
        setCurrentArrayData([...stageQuestions[indeksBaru].initialArray]);
        setStudentMoves(0);
      }
    } else if (indeksBaru === maxQuestions) {
    // Jika menekan "Selanjutnya" di soal terakhir, pemicu Jendela Pop-up muncul!
    setShowStageConfirmPopup(true);
  }
  };

  // 🌟 ENGINE UTAMA: Hitung skor massal satu paket tahap ketika klik "LANJUT"
  const eksekusiPindahTahapResmi = () => {
    let totalSkorBaru = score;
    let totalSalahBaru = incorrectAttempts;

    // Looping pemeriksaan seluruh jawaban di Tahap ini secara rahasia
    const jawabanTahapIni = stageAnswers[`stage_${currentStage}`] || {};

    stageQuestions.forEach((soal, idx) => {
      if (!soal) return; 
      
      let jawabanSiswa = (jawabanTahapIni[idx] || '').trim().toUpperCase();
      
      // 1. Validasi khusus Saklar Biner Tahap 1
      if (currentStage === 1 && soal.mode === 'switch') {
        const sw = jawabanTahapIni[`switch_${idx}`] || [0, 0, 0, 0, 0];
        const calculatedDecimal = sw.reduce((acc, bit, i) => acc + (bit * [16, 8, 4, 2, 1][i]), 0);
        if (calculatedDecimal === soal.targetNum) totalSkorBaru++; else totalSalahBaru++;
        return;
      }

      // 2. Validasi khusus Sirkuit Logika Tahap 2
      if (currentStage === 2 && soal.mode === 'interactive-circuit') {
        const gate = jawabanTahapIni[`circuit_${idx}`] || { G1: null };
        if (soal.correctGates && gate.G1 === soal.correctGates.G1) totalSkorBaru++; else totalSalahBaru++;
        return;
      }

      // 3. Validasi khusus Parity Grid Tahap 5 (Sudah dihitung instan saat klik tabel)
      if (currentStage === 5) {
        return;
      }

      // 4. 🔒 Guard 2 & Perbaikan Utama: Validasi text input biasa dengan pengecekan aman (Safe-Trim)
      const kunciJawabanAsli = soal.answer ? soal.answer.toString().trim().toUpperCase() : '';
      
      if (kunciJawabanAsli && jawabanSiswa === kunciJawabanAsli) {
        totalSkorBaru++;
      } else {
        totalSalahBaru++;
      }
    });

    setScore(totalSkorBaru);
    setIncorrectAttempts(totalSalahBaru);

    if (currentStage === 6) {
      setIsExamComplete(true);
      // Kirim hasil akhir ke Supabase
      const kirimNilaiAkhir = async () => {
        const nilaiKonversi = Math.round((totalSkorBaru / totalPossiblePoints) * 100);
        await supabase
          .from('token_ujian')
          .update({ sudah_ujian: true, skor_benar: totalSkorBaru, nilai_akhir: nilaiKonversi })
          .eq('kode_token', inputToken.trim().toUpperCase())
          .eq('nama_siswa', studentName.trim().toUpperCase());
        localStorage.clear();
        alert("✅ Ujian Selesai! Semua data jawaban Anda telah diamankan ke server pusat.");
        window.location.reload(); 
      };
      kirimNilaiAkhir();
    } else {
      // 🌟 HAPUS JEJAK LAMA: Bersihkan memori tahap yang baru saja diselesaikan agar tidak bentrok
      localStorage.removeItem(`tycoon_pack_stage_${currentStage}`);
      localStorage.removeItem(`tycoon_answers_stage_${currentStage}`);
      localStorage.removeItem('tycoon_array_terakhir');
      localStorage.removeItem('tycoon_moves_terakhir');

      const nextStageNum = currentStage + 1;
      localStorage.setItem('tycoon_tahap_sekarang', String(nextStageNum));
      setCurrentStage(nextStageNum);
      setQuestionsAnsweredInStage(0);
      initStageQuestions(nextStageNum);
      setShowStageConfirmPopup(false);
    }
  };

  // Penanganan khusus klik tabel grid Tahap 5 langsung mengunci memori jawaban
  const handleGridCellClick = (rowIndex, colIndex) => {
    if (currentStage !== 5 || !activeQuestion) return;
    const isCorrect = activeQuestion.errorType === 'BARIS' ? rowIndex === activeQuestion.errorIndex : colIndex === activeQuestion.errorIndex;
    if (isCorrect) setScore(prev => prev + 1); else setIncorrectAttempts(prev => prev + 1);
    navigasiKeSoal(1);
  };


  const handleDragStart = (e, index) => {
    if (currentStage !== 6 || isExamComplete) return;
    e.dataTransfer.setData("text/plain", index);
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    setDraggedOverIdx(index);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    setDraggedOverIdx(null);

    if (currentStage !== 6 || isExamComplete) return;

    const sourceIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
    if (isNaN(sourceIndex) || sourceIndex === targetIndex) return;

    let updatedArray = [...currentArrayData];
    const [movedValue] = updatedArray.splice(sourceIndex, 1);
    updatedArray.splice(targetIndex, 0, movedValue);

    // 1. Perbarui state visual dan memori lokal HP siswa
    setCurrentArrayData(updatedArray);
    localStorage.setItem('tycoon_array_terakhir', JSON.stringify(updatedArray));
    
    const newMovesCount = studentMoves + 1;
    setStudentMoves(newMovesCount);
    localStorage.setItem('tycoon_moves_terakhir', String(newMovesCount));

    // 🌟 KODE BARU: Kirim susunan blok data terbaru ke Supabase agar status sortir terkunci di cloud!
    try {
      const tokenAktif = localStorage.getItem('tycoon_token_aktif') || inputToken;
      const namaAktif = localStorage.getItem('tycoon_nama_siswa') || studentName;

      if (tokenAktif && namaAktif) {
        supabase
          .from('token_ujian')
          .select('soal_live')
          .eq('kode_token', tokenAktif.trim().toUpperCase())
          .eq('nama_siswa', namaAktif.trim().toUpperCase())
          .maybeSingle()
          .then(({ data: currentData }) => {
            const currentSoalLive = currentData?.soal_live || {};
            
            // Pastikan paket soal Tahap 6 ada sebelum memperbarui array di dalamnya
            if (currentSoalLive[`stage_6`]) {
              const qIdx = questionsAnsweredInStage;
              
              // Simpan susunan blok terbaru ke properti khusus 'savedProgressArray'
              currentSoalLive[`stage_6`][qIdx].savedProgressArray = updatedArray;

              supabase
                .from('token_ujian')
                .update({ soal_live: currentSoalLive })
                .eq('kode_token', tokenAktif.trim().toUpperCase())
                .eq('nama_siswa', namaAktif.trim().toUpperCase())
                .then();
            }
          });
      }
    } catch (err) {
      console.error("Gagal mengamankan progres sortir ke cloud:", err);
    }

    // Jalankan logika pengecekan apakah susunan array sudah benar (Sorted)
    let isSorted = false;
    const qNum = activeQuestion.qNum;

    if (qNum === 1) {
      isSorted = updatedArray.every((val, i) => i === 0 || updatedArray[i - 1] <= val);
    } else if (qNum === 2) {
      let validPartition = true;
      let foundEven = false;
      for (let i = 0; i < updatedArray.length; i++) {
        if (updatedArray[i] % 2 === 0) foundEven = true;
        else if (foundEven) validPartition = false;
      }
      if (validPartition) {
        const odds = updatedArray.filter(v => v % 2 !== 0);
        const evens = updatedArray.filter(v => v % 2 === 0);
        const oddsSorted = odds.every((val, i) => i === 0 || odds[i - 1] <= val);
        const evensSorted = evens.every((val, i) => i === 0 || evens[i - 1] <= val);
        isSorted = oddsSorted && evensSorted;
      }
    } else if (qNum === 3) {
      isSorted = updatedArray.every((val, i) => i === 0 || val.localeCompare(updatedArray[i - 1]) >= 0);
    } else if (qNum === 4) {
      const maxVal = Math.max(...updatedArray);
      const peakIndex = updatedArray.indexOf(maxVal);
      const leftSide = updatedArray.slice(0, peakIndex + 1);
      const rightSide = updatedArray.slice(peakIndex);
      const leftSorted = leftSide.every((val, i) => i === 0 || leftSide[i - 1] <= val);
      const rightSorted = rightSide.every((val, i) => i === 0 || rightSide[i - 1] >= val);
      isSorted = leftSorted && rightSorted;
    } else if (qNum === 5) {
      let validPartition = true;
      let foundHighSatuan = false;
      for (let i = 0; i < updatedArray.length; i++) {
        const ekor = updatedArray[i] % 10;
        if (ekor >= 5 && ekor <= 9) foundHighSatuan = true;
        else if (foundHighSatuan) validPartition = false;
      }
      if (validPartition) {
        const groupLow = updatedArray.filter(v => (v % 10) <= 4);
        const groupHigh = updatedArray.filter(v => (v % 10) >= 5);
        const lowSorted = groupLow.every((val, i) => i === 0 || groupLow[i - 1] <= val);
        const highSorted = groupHigh.every((val, i) => i === 0 || groupHigh[i - 1] <= val);
        isSorted = lowSorted && highSorted;
      }
    }

    if (isSorted) {
      if (newMovesCount <= activeQuestion.maxEffectiveMoves) {
        navigasiKeSoal(1); 
      } else {
        setIncorrectAttempts(prev => prev + 1);
        navigasiKeSoal(1); 
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };


  const totalPossiblePoints = 44;

  return (
    <div className="min-h-screen bg-stone-100 p-2 sm:p-6 font-mono text-stone-900 selection:bg-black selection:text-white overflow-x-hidden">

      {!isAuthenticated ? (
        /* ========================================================================= */
        /* 🔐 TAMPILAN HALAMAN LOGIN RETRO (MENGGUNAKAN SUPABASE TOKEN)              */
        /* ========================================================================= */
        <div className="max-w-md mx-auto mt-8 md:mt-16 bg-white border-4 border-black p-4 md:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-xl md:text-3xl font-black uppercase tracking-wider text-center mb-2">FORUM LOGIN</h1>
          <p className="text-[10px] md:text-xs font-bold text-stone-400 text-center uppercase tracking-widest mb-4 md:mb-6">PENILAIAN AKHIR SEMESTER GENAP KODING</p>

          {feedback.msg && (
            <div className={`p-3 mb-4 md:mb-6 border-2 md:border-4 border-black font-bold uppercase text-xs md:text-sm text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${feedback.type === 'error' ? 'bg-rose-300' : 'bg-emerald-300'}`}>
              {feedback.msg}
            </div>
          )}

          <div className="space-y-3 md:space-y-4">
            <div>
              <label className="block text-[10px] md:text-xs font-black uppercase mb-1">NAMA</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="CONTOH: AHMAD"
                className="w-full border-2 md:border-4 border-black p-2 md:p-3 text-sm md:text-base font-bold uppercase focus:outline-none focus:bg-yellow-50 placeholder:text-stone-300"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-[10px] md:text-xs font-black uppercase mb-1">kode token</label>
              <input
                type="text"
                value={inputToken}
                onChange={(e) => checkTokenUntukAksesGuru(e.target.value)}
                placeholder="CONTOH: VII1-XYZ"
                className="w-full border-2 md:border-4 border-black p-2 md:p-3 text-sm md:text-base font-bold uppercase focus:outline-none focus:bg-yellow-50 placeholder:text-stone-300"
                disabled={isLoading}
                onKeyDown={(e) => e.key === 'Enter' && handleLoginUjian()}
              />
            </div>
            <button
              onClick={handleLoginUjian}
              disabled={isLoading}
              className="w-full mt-4 bg-blue-600 text-white p-3 md:p-4 font-black uppercase tracking-widest border-2 md:border-4 border-black hover:bg-blue-700 active:translate-y-0.5 shadow-[2px_2px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 cursor-pointer text-xs md:text-sm"
            >
              {isLoading ? "🔄 MEMERIKSA TOKEN CLOUD..." : "LOG IN"}
            </button>
          </div>
          <div className="text-[9px] md:text-[10px] text-stone-400 font-bold text-center mt-6 uppercase leading-tight">
            Sistem Hibrida Aktif. Progres otomatis terkunci pada perangkat smartphone setelah token berhasil diverifikasi server.
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* 🎮 TAMPILAN AREA GAME UTAMA (AKAN TERBUKA JIKA LOLOS TOKEN)               */
        /* ========================================================================= */
        <>
          {/* HUD HEADER KELAS 7: FOKUS MURNI IDENTITAS SISWA */}
          <header className="border-4 border-black bg-white p-3 md:p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4 md:mb-6 text-center md:text-left">
            <h1 className="text-lg md:text-2xl font-black uppercase tracking-wide text-stone-900">
              👤 {studentName}
            </h1>
            <p className="text-xs md:text-sm font-bold text-blue-600 uppercase mt-0.5 tracking-wider">
              🟢 STATUS: TERMINAL UJIAN AKTIF // KELAS: {studentClass}
            </p>
          </header>

          {feedback.msg && (
            <div className={`p-3 mb-4 md:mb-6 border-2 md:border-4 border-black font-bold uppercase text-xs md:text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${feedback.type === 'error' ? 'bg-rose-300' : 'bg-emerald-300'}`}>
              {feedback.msg}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 📊 PANEL UTAMA MONITORING & REKAP NILAI DIREKTUR GURU                     */}
          {/* ========================================================================= */}
          {currentStage === 999 ? (
            <div className="border-4 border-black bg-white p-4 md:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-center border-b-4 border-black pb-4 mb-4 md:mb-6 gap-4">
                <div className="text-center md:text-left">
                  <h2 className="text-xl md:text-2xl font-black uppercase text-stone-900">🗃️ SERVER MONITORING UTAMA GURU</h2>
                  <p className="text-[10px] md:text-xs font-bold text-blue-600 uppercase mt-0.5 tracking-wider animate-pulse">
                    🟢 KONEKSI WEBSOCKET CLOUD AKTIF // MEMANTAU LIVE JAWABAN SISWA...
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={jalankanSimulasiBots}
                    disabled={isSimulating}
                    className={`flex-1 md:flex-none text-black px-4 py-2 border-2 md:border-4 border-black font-black uppercase text-[10px] md:text-xs tracking-wider shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all cursor-pointer ${isSimulating ? 'bg-stone-300 animate-pulse' : 'bg-yellow-400 hover:bg-yellow-300'}`}
                  >
                    {isSimulating ? "🤖 BOTS SEDANG BERAKSI..." : "⚡ SIMULASI BOTS REAL-TIME"}
                  </button>

                  {/* TOMBOL UNDUH SPREADSHEET ASLI (Sekitar baris 783) */}
                  <button
                    type="button"
                    onClick={unduhRekapNilaiExcel}
                    className="flex-1 md:flex-none bg-emerald-400 hover:bg-emerald-300 text-black px-4 py-2 border-2 md:border-4 border-black font-black uppercase text-[10px] md:text-xs tracking-wider shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all cursor-pointer"
                  >
                    📥 UNDUH SPREADSHEET (.CSV)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.clear();
                      window.location.reload();
                    }}
                    className="flex-1 md:flex-none bg-stone-900 text-white text-[10px] md:text-xs font-black uppercase px-4 py-2 border-2 border-black hover:bg-stone-800 shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                  >
                    ⬅️ KEMBALI
                  </button>
                </div>
              </div>

              {/* LIVE MONITORING TABLE WITH DETAIL INSPECTION */}
              <div className="w-full overflow-x-auto border-2 md:border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                <table className="w-full font-mono text-[11px] md:text-xs text-left border-collapse bg-stone-50">
                  <thead>
                    <tr className="bg-stone-950 text-yellow-400 font-black uppercase border-b-2 border-black">
                      <th className="p-2 md:p-3 border-r border-black text-center w-12">NO</th>
                      <th className="p-2 md:p-3 border-r border-black">NAMA SISWA</th>
                      <th className="p-2 md:p-3 border-r border-black text-center w-20">KELAS</th>
                      <th className="p-2 md:p-3 border-r border-black">ISI LEMBAR JAWABAN (LIVE)</th>
                      <th className="p-2 md:p-3 border-r border-black text-center">STATUS</th>
                      <th className="p-2 md:p-3 border-r border-black text-center">SKOR MENTAH</th>
                      <th className="p-2 md:p-3 text-center">NILAI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {liveStudentsData.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="p-8 text-center text-stone-400 font-bold uppercase tracking-widest bg-white">
                          📭 Belum ada data siswa ter-sinkronisasi di cloud...
                        </td>
                      </tr>
                    ) : (
                      liveStudentsData.map((siswa, indeks) => {
                        // Membaca dan merapikan visual data JSON live jawaban siswa
                        const liveAns = siswa.jawaban_live || {};
                        const barisJawaban = Object.keys(liveAns).map(key => {
                          if (key.startsWith('switch_')) {
                            return `[S${parseInt(key.split('_')[1])+1}: Biner ${JSON.stringify(liveAns[key])}]`;
                          }
                          if (key.startsWith('circuit_')) {
                            return `[S${parseInt(key.split('_')[1])+1}: Sirkuit=${liveAns[key]?.G1}]`;
                          }
                          return `[Soal ${parseInt(key)+1}: "${liveAns[key]}"]`;
                        }).join(' | ');

                        return (
                          <tr 
                            key={`${siswa.kode_token}-${siswa.nama_siswa}`} 
                            className={`border-b border-black font-bold transition-all duration-300 ${siswa.sudah_ujian ? 'bg-emerald-50 hover:bg-emerald-100' : 'bg-white hover:bg-yellow-50'}`}
                          >
                            <td className="p-2 md:p-3 border-r border-black text-center font-black bg-stone-100">{indeks + 1}</td>
                            <td className="p-2 md:p-3 border-r border-black uppercase tracking-tight text-stone-800 font-black">{siswa.nama_siswa}</td>
                            <td className="p-2 md:p-3 border-r border-black text-center text-blue-600 bg-stone-50/50">{siswa.kelas}</td>
                            
                            {/* 🔍 BARU: Kolom Detektif Jawaban Siswa per Nomor Soal */}
                            <td className="p-2 md:p-3 border-r border-black text-[10px] text-stone-600 font-mono max-w-xs md:max-w-md truncate hover:whitespace-normal break-all">
                              {barisJawaban ? barisJawaban : <span className="text-stone-300 italic">Belum mengisi lembar jawaban...</span>}
                            </td>

                            <td className="p-2 md:p-3 border-r border-black text-center">
                              <span className={`px-2 py-0.5 border border-black font-black uppercase text-[9px] rounded-md shadow-[1px_1px_0px_rgba(0,0,0,1)] ${siswa.sudah_ujian ? 'bg-emerald-300 text-stone-900' : 'bg-amber-300 text-stone-900'}`}>
                                {siswa.sudah_ujian ? "🔒 SELESAI" : "⚡ PROGRES"}
                              </span>
                            </td>
                            <td className="p-2 md:p-3 border-r border-black text-center font-black text-stone-700 bg-stone-100/50">
                              {siswa.skor_benar !== null ? `${siswa.skor_benar} / 44` : "0 / 44"}
                            </td>
                            <td className="p-2 md:p-3 text-center">
                              <span className={`font-black text-sm ${siswa.nilai_akhir >= 75 ? 'text-emerald-600' : 'text-stone-900'}`}>
                                {siswa.nilai_akhir !== null ? `${siswa.nilai_akhir}%` : "0%"}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : isExamComplete ? (

            /* 📊 LAYAR PENGUNCIAN HASIL FINAL SISWA */
            <div className="border-4 border-black bg-white p-6 md:p-8 text-center max-w-2xl mx-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] my-6 md:my-12">
              <h2 className="text-2xl md:text-4xl font-black text-emerald-600 uppercase tracking-tight mb-2">📊 HASIL EVALUASI UJIAN</h2>
              <p className="text-stone-600 font-bold mb-4 md:mb-6 text-sm md:text-lg">Semua sesi operasi diamankan. Lembar kalkulasi skor berhasil diterbitkan ke cloud.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto mb-6">
                <div className="bg-stone-900 text-yellow-400 p-4 border-4 border-black text-lg md:text-xl font-black">
                  PENCAPAIAN SKOR: {score} / {totalPossiblePoints}
                </div>
                <div className="bg-stone-900 text-rose-400 p-4 border-4 border-black text-lg md:text-xl font-black">
                  TOTAL SALAH: {incorrectAttempts}
                </div>
              </div>
              <div className="bg-yellow-300 text-black font-black border-4 border-black p-4 text-xl md:text-2xl uppercase shadow-[4px_4px_0px_rgba(0,0,0,1)] mb-4">
                PREDIKAT NILAI AKHIR: {Math.round((score / totalPossiblePoints) * 100)}%
              </div>
              <p className="text-[10px] md:text-xs font-bold text-stone-400 uppercase">Token ujian Anda telah hangus. Silakan letakkan smartphone di meja dan tunggu instruksi Guru.</p>
            </div>
          ) : (
            /* KONTEN UTAMA JALANNYA SOAL (TAHAP 1-6) */
            <div className="w-full max-w-3xl mx-auto">
              {/* CONTAINER UTAMA SOAL */}
              <div className="border-4 border-black bg-white p-4 md:p-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">

                <div className="bg-black text-white p-3 md:p-4 mb-4 border-2 border-black flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div>
                    <h2 className="text-base md:text-xl font-black uppercase tracking-wide">💼 {STAGE_CONFIG[currentStage].title}</h2>
                    <p className="text-[9px] md:text-xs text-stone-300 font-bold mt-0.5">{STAGE_CONFIG[currentStage].description}</p>
                  </div>
                  <div className="bg-blue-600 text-white border-2 border-white px-2 py-1 md:px-3 md:py-1 font-black text-[10px] md:text-xs uppercase shadow-[2px_2px_0px_rgba(255,255,255,1)] whitespace-nowrap text-center">
                    SOAL {questionsAnsweredInStage + 1} / {
                      currentStage === 1 ? 9 :
                        currentStage === 2 ? 10 :
                          currentStage === 4 ? 10 : 5
                    }
                  </div>
                </div>

                {/* 📊 INTERAKTIF JALUR SERET & SISIP UNTUK TAHAP 6 */}
                {currentStage === 6 && currentArrayData.length > 0 && (
                  <div className="my-4 md:my-6 w-full mx-auto bg-white border-2 md:border-4 border-black p-3 md:p-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center">
                    <div className="text-[10px] md:text-xs font-bold text-stone-500 uppercase mb-4 tracking-wider flex justify-between px-1 md:px-2">
                      <span>Langkah: <strong className="text-blue-600">{studentMoves}</strong></span>
                      <span>Batas Efektif: <strong className="text-rose-600">{activeQuestion?.maxEffectiveMoves}</strong></span>
                    </div>

                    <div className="flex justify-start md:justify-center items-end gap-1 md:gap-1.5 bg-stone-100 p-2 md:p-4 border-2 md:border-4 border-black border-double min-h-40 md:min-h-55 w-full overflow-x-auto">
                      {currentArrayData.map((value, idx) => {
                        const isTargetHovered = draggedOverIdx === idx;
                        let numericWeight = typeof value === 'string'
                          ? (value.charCodeAt(0) - 50) * 10 + parseInt(value[1] || 0, 10) * 2
                          : value;
                        const heightStyle = { height: `${40 + (numericWeight * 1.0)}px` };

                        return (
                          <div
                            key={value}
                            className="flex flex-1 items-end relative min-w-8.75 md:min-w-0"
                            onDragEnter={(e) => handleDragEnter(e, idx)}
                            onDragLeave={handleDragLeave}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, idx)}
                          >
                            {isTargetHovered && (
                              <div className="absolute left-0 top-0 bottom-0 w-1 md:w-1.5 bg-yellow-400 border-l border-r md:border-l-2 md:border-r-2 border-black border-dashed animate-pulse z-20" />
                            )}

                            <div
                              draggable
                              onDragStart={(e) => handleDragStart(e, idx)}
                              style={heightStyle}
                              className={`w-full border border-black md:border-2 md:border-black font-mono flex flex-col justify-between items-center py-1 md:py-2 transition-all duration-150 cursor-grab active:cursor-grabbing shadow-[1px_1px_0px_rgba(0,0,0,1)] md:shadow-[1px_2px_0px_rgba(0,0,0,1)] select-none ${isTargetHovered ? 'bg-amber-100 border-dashed opacity-80 scale-95' : 'bg-orange-300 text-stone-900 hover:bg-orange-200'}`}
                            >
                              <span className="text-[7px] md:text-[9px] font-black opacity-30">
                                {currentArrayData.length <= 15 ? `#${idx + 1}` : ''}
                              </span>
                              <span className={`font-black tracking-tighter ${currentArrayData.length > 20 ? 'text-[10px] md:text-xs' : 'text-xs md:text-sm'}`}>
                                {value}
                              </span>
                              <span className="text-[6px] md:text-[9px] opacity-40">===</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* BOX KONSOL SOAL ACTIVE */}
                {currentStage !== 3 && activeQuestion && (
                  <div className="border-2 md:border-4 border-black bg-stone-50 p-4 md:p-6 mb-4 md:mb-6 shadow-inner relative">
                    <div className="absolute top-1.5 left-1.5 md:top-2 md:left-2 flex gap-1">
                      <span className="w-2.5 h-2.5 md:w-3 md:h-3 bg-red-500 rounded-full border border-black"></span>
                      <span className="w-2.5 h-2.5 md:w-3 md:h-3 bg-yellow-500 rounded-full border border-black"></span>
                      <span className="w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full border border-black"></span>
                    </div>
                    <div className="text-right text-[9px] md:text-xs font-black text-stone-400 mb-2 uppercase tracking-widest">
                      Kompilator Aktif
                    </div>

                    {currentStage === 2 ? (
                      <div className="space-y-4 mt-2 md:mt-4">
                        <div className="text-sm md:text-base font-black leading-relaxed text-stone-800">
                          {activeQuestion?.question}
                        </div>
                        <div className="bg-stone-950 p-3 md:p-4 border-2 md:border-4 border-black shadow-inner relative overflow-x-auto">
                          <div className="absolute top-1 right-2 text-[6px] md:text-[8px] font-mono text-stone-600 font-bold tracking-widest">IDE_KODE_SEMU</div>
                          <pre className="font-mono text-[10px] md:text-sm text-emerald-400 leading-relaxed tracking-wide whitespace-pre">
                            {activeQuestion?.codeLines?.map((line, index) => (
                              <div key={index} className="hover:bg-stone-900 px-1 py-0.5 rounded transition-colors">
                                {line}
                              </div>
                            ))}
                          </pre>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm md:text-lg font-black leading-relaxed mt-2 md:mt-4 mb-2 md:mb-4">
                        {activeQuestion?.question}
                      </div>
                    )}

                    {/* RENDERING RETRO SWITCHES UNTUK TAHAP 1 */}
                    {currentStage === 1 && activeQuestion?.mode === 'switch' && (
                      <div className="my-4 md:my-6 max-w-md mx-auto bg-white border-2 md:border-4 border-black p-3 md:p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center">
                        <div className="grid grid-cols-5 gap-1 md:gap-2 mb-4">
                          {[16, 8, 4, 2, 1].map((weight, idx) => (
                            <div key={idx} className="flex flex-col items-center">
                              <span className="text-[10px] md:text-xs text-stone-400 font-bold mb-1">[{weight}]</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setBinarySwitches(prev => {
                                    const updated = [...prev];
                                    updated[idx] = updated[idx] === 0 ? 1 : 0;
                                    return updated;
                                  });
                                }}
                                className={`w-10 h-14 md:w-12 md:h-16 border-2 md:border-4 border-black font-mono text-lg md:text-xl font-black flex items-center justify-center transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 select-none cursor-pointer ${binarySwitches[idx] === 1 ? 'bg-emerald-400 text-black translate-y-0.5 shadow-none' : 'bg-stone-200 text-stone-600'}`}
                              >
                                {binarySwitches[idx]}
                              </button>
                              <span className="text-[8px] md:text-[10px] text-stone-500 font-bold mt-1 uppercase">
                                {binarySwitches[idx] === 1 ? 'NYALA' : 'MATI'}
                              </span>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={checkAnswer}
                          className="w-full mt-2 bg-black text-white p-2 font-black uppercase text-[10px] md:text-xs tracking-wider border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 cursor-pointer"
                        >
                          KIRIM KONFIGURASI SAKLAR
                        </button>
                      </div>
                    )}

                    {/* MATRIKS GRID PERSEGI PROGRESAL */}
                    {currentStage === 5 && activeQuestion?.gridData && (
                      <div className="my-4 md:my-6 w-full overflow-x-auto p-1 md:p-2 bg-white border-2 md:border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <table className="mx-auto font-mono text-xs md:text-sm font-black border-collapse">
                          <thead>
                            <tr>
                              <th className="p-1 text-stone-400 text-[9px] md:text-xs px-1 md:px-2"></th>
                              {Array.from({ length: activeQuestion.gridSize }).map((_, colIdx) => (
                                <th key={colIdx} className="p-1 bg-stone-100 border border-black text-[9px] md:text-xs min-w-7.5 md:min-w-10">
                                  K{colIdx + 1}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {activeQuestion.gridData.map((rowArr, rowIndex) => {
                              const labelBaris = activeQuestion.gridSize - rowIndex;
                              return (
                                <tr key={rowIndex}>
                                  <td className="p-1 bg-stone-100 border border-black text-[9px] md:text-xs text-center font-bold px-1 md:px-2">B{labelBaris}</td>
                                  {rowArr.map((cellValue, colIndex) => (
                                    <td key={colIndex} className="p-0 border border-black">
                                      <button
                                        type="button"
                                        onClick={() => handleGridCellClick(rowIndex, colIndex)}
                                        className={`w-full h-full p-2 md:p-3 text-center font-mono text-sm md:text-base font-extrabold transition-all cursor-pointer select-none active:scale-95 ${cellValue === 1 ? 'bg-stone-900 text-yellow-300 hover:bg-stone-800' : 'bg-white text-stone-800 hover:bg-stone-50'}`}
                                      >
                                        {cellValue}
                                      </button>
                                    </td>
                                  ))}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* INTERACTIVE LOGIC CIRCUIT TAHAP 2 */}
                {currentStage === 2 && activeQuestion?.mode === 'interactive-circuit' && (
                  <div className="my-4 md:my-6 p-4 md:p-6 bg-stone-950 border-2 md:border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center relative rounded-md md:rounded-lg">
                    <div className="max-w-md mx-auto bg-stone-900 p-4 md:p-6 border md:border-2 border-stone-800 rounded-lg font-mono text-white space-y-4 md:space-y-6">
                      <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                        {activeQuestion.inputs.A !== undefined && (
                          <div className="bg-stone-950 p-2 border border-stone-700 rounded text-center min-w-17.5 md:min-w-20 grow">
                            <span className="text-stone-500 font-bold text-[8px] md:text-[9px] block mb-1">🔌 SAKLAR A</span>
                            <span className={`text-[10px] md:text-xs font-black px-2 py-0.5 rounded ${activeQuestion.inputs.A === 1 ? 'bg-emerald-400 text-black' : 'bg-stone-800 text-stone-400'}`}>
                              {activeQuestion.inputs.A === 1 ? "AKTIF (1)" : "MATI (0)"}
                            </span>
                          </div>
                        )}
                        {activeQuestion.inputs.B !== undefined && (
                          <div className="bg-stone-950 p-2 border border-stone-700 rounded text-center min-w-17.5 md:min-w-20 grow">
                            <span className="text-stone-500 font-bold text-[8px] md:text-[9px] block mb-1">🔌 SAKLAR B</span>
                            <span className={`text-[10px] md:text-xs font-black px-2 py-0.5 rounded ${activeQuestion.inputs.B === 1 ? 'bg-emerald-400 text-black' : 'bg-stone-800 text-stone-400'}`}>
                              {activeQuestion.inputs.B === 1 ? "AKTIF (1)" : "MATI (0)"}
                            </span>
                          </div>
                        )}
                        {activeQuestion.inputs.C !== undefined && (
                          <div className="bg-stone-950 p-2 border border-stone-700 rounded text-center min-w-17.5 md:min-w-20 grow">
                            <span className="text-stone-500 font-bold text-[8px] md:text-[9px] block mb-1">🔌 SAKLAR C</span>
                            <span className={`text-[10px] md:text-xs font-black px-2 py-0.5 rounded ${activeQuestion.inputs.C === 1 ? 'bg-emerald-400 text-black' : 'bg-stone-800 text-stone-400'}`}>
                              {activeQuestion.inputs.C === 1 ? "AKTIF (1)" : "MATI (0)"}
                            </span>
                          </div>
                        )}
                        {activeQuestion.inputs.D !== undefined && (
                          <div className="bg-stone-950 p-2 border border-stone-700 rounded text-center min-w-17.5 md:min-w-20 grow">
                            <span className="text-stone-500 font-bold text-[8px] md:text-[9px] block mb-1">🔌 SAKLAR D</span>
                            <span className={`text-[10px] md:text-xs font-black px-2 py-0.5 rounded ${activeQuestion.inputs.D === 1 ? 'bg-emerald-400 text-black' : 'bg-stone-800 text-stone-400'}`}>
                              {activeQuestion.inputs.D === 1 ? "AKTIF (1)" : "MATI (0)"}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="bg-stone-950 p-2 md:p-3 border border-amber-500/20 rounded text-left text-[10px] md:text-xs space-y-1 md:space-y-2">
                        <span className="text-amber-400 font-black block text-[8px] md:text-[10px] uppercase tracking-wider">📋 PANDUAN ATURAN ALIRAN SISTEM:</span>
                        {activeQuestion.circuitType === 'LIGHT-AND' && (
                          <p className="text-stone-300 leading-relaxed">**Aturan Seri (DAN):** Listrik hanya mengalir jika Saklar A **DAN** Saklar B dua-duanya berada di posisi **AKTIF (1)**.</p>
                        )}
                        {activeQuestion.circuitType === 'LIGHT-INVERT-AND' && (
                          <p className="text-stone-300 leading-relaxed">**Aturan Inversi Seri:** Balikkan dulu nilai status Saklar A (1 jadi 0, 0 jadi 1). Lalu operasikan hasil hitungan baru itu secara **SERI (DAN)** dengan letak Saklar B.</p>
                        )}
                        {activeQuestion.circuitType === 'LIGHT-MIX-3WAY' && (
                          <p className="text-stone-300 leading-relaxed">**Aturan Perpaduan:** Nilai hitungan **SERI (DAN)** antara letak Saklar A & B. Jika hasilnya siap, rangkaikan perpaduan itu secara **PARALEL (ATAU)** dengan posisi Saklar C.</p>
                        )}
                        {activeQuestion.circuitType === 'LIGHT-INVERT-MIX' && (
                          <p className="text-stone-300 leading-relaxed">**Aturan Inversi Gabungan:** Tukar putaran pada letak Saklar A, lalu satukan memakai **SERI (DAN)** bersama kedudukan Saklar B. Di sisi berbeda, tukar pula nilai Saklar C. Terakhir, gabungkan kedua jalur tadi memanfaatkan operasi **PARALEL (ATAU)**.</p>
                        )}
                        {activeQuestion.circuitType === 'LIGHT-FINAL-BOSS-4WAY' && (
                          <p className="text-stone-300 leading-relaxed">**Aturan Ujian Empat Saklar Bos:** Kerjakan perpaduan Jalur Atas (Saklar A **SERI** B). Berikutnya, kerjakan perpaduan Jalur Bawah (Saklar C **SERI** D). Lampu induk terakhir akan **MENYALA (1)** asalkan perhitungan antara Jalur Atas **ATAU** Jalur Bawah mempunyai arus senilai 1.</p>
                        )}
                      </div>

                      <div className="bg-stone-950 p-3 md:p-4 border border-stone-800 rounded-md text-center">
                        <span className="text-[8px] md:text-[10px] text-stone-400 font-black block mb-2">STATUS INDIKATOR LAMPU UTAMA (G1)</span>
                        <button
                          type="button"
                          onClick={() => setCircuitGates(prev => ({ ...prev, G1: prev.G1 === null ? 0 : (prev.G1 === 0 ? 1 : null) }))}
                          className={`w-full py-2 md:py-3 text-xs md:text-sm font-black border-2 md:border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] md:shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all cursor-pointer ${circuitGates.G1 === null ? 'bg-stone-700 text-stone-300' : (circuitGates.G1 === 1 ? 'bg-yellow-400 text-black' : 'bg-rose-500 text-white')}`}
                        >
                          {circuitGates.G1 === null ? "💡 KLIK: JAWAB STATUS" : (circuitGates.G1 === 1 ? "💡 LAMPU MENYALA (1)" : "🔌 LAMPU MATI (0)")}
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-6 max-w-xs mx-auto">
                      <button
                        type="button"
                        onClick={() => {
                          navigasiKeSoal(1);
                        }}
                        className="w-full bg-yellow-400 hover:bg-yellow-300 text-black py-2 px-3 md:py-3 md:px-4 border-2 md:border-4 border-black font-black uppercase tracking-wider shadow-[2px_2px_0px_rgba(0,0,0,1)] md:shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-0.5 text-[10px] md:text-xs transition-all cursor-pointer"
                      >
                        ⚡ PERIKSA JAWABAN SAKLAR
                      </button>
                    </div>
                  </div>
                )}

                {/* PENGGANTI INPUT FORM TEXT LAMA: MENDUKUNG RE-CHECKING SISWA */}
                {((currentStage === 2 && activeQuestion?.mode !== 'interactive-circuit') ||
                  (currentStage === 1 && activeQuestion?.mode !== 'switch') ||
                  currentStage === 4 || currentStage === 3) && (
                    <div className="space-y-4">
                      <input
                        type={currentStage === 3 ? "number" : "text"}
                        value={playerAnswer}
                        onChange={(e) => setPlayerAnswer(e.target.value)}
                        placeholder="Ketik jawaban kamu di sini..."
                        className="w-full border-2 md:border-4 border-black p-2 md:p-3 font-bold focus:outline-none focus:bg-yellow-50 text-sm md:text-base uppercase shadow-inner placeholder:text-stone-400"
                      />
                    </div>
                  )}

                {/* 🌟 PANEL BARU: TOMBOL NAVIGASI MAJU MUNDUR SOAL */}
                <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t-2 border-stone-200">
                  <button
                    type="button"
                    disabled={questionsAnsweredInStage === 0}
                    onClick={() => navigasiKeSoal(-1)}
                    className="bg-stone-200 text-black py-2 px-4 font-black border-2 md:border-4 border-black hover:bg-stone-300 disabled:opacity-40 text-xs md:text-sm cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] uppercase"
                  >
                    ⬅️ Soal Sebelumnya
                  </button>
                  <button
                    type="button"
                    onClick={() => navigasiKeSoal(1)}
                    className="bg-black text-white py-2 px-4 font-black border-2 md:border-4 border-black hover:bg-stone-800 text-xs md:text-sm cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] uppercase"
                  >
                    {questionsAnsweredInStage === (currentStage === 1 ? 8 : (currentStage === 2 || currentStage === 4 ? 9 : 4))
                      ? "🔒 SELESAI TAHAP"
                      : "Soal Berikutnya ➡️"}
                  </button>
                </div>

                {/* TAMPILAN TAHAP 3 NEON GRID */}
                {currentStage === 3 && activeQuestion && (
                  <div className="my-4 md:my-6 p-4 md:p-6 bg-stone-950 border-2 md:border-4 border-black text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                    <div className="text-[8px] md:text-[10px] font-black text-emerald-400 tracking-widest uppercase mb-4 animate-pulse flex items-center justify-center gap-1.5">
                      <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500" />
                      PENGANALISIS PERULANGAN LOGIKA AKTIF
                      <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500" />
                    </div>

                    <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3 my-4 md:my-6">
                      {activeQuestion.question.match(/\d+,\s*\d+,\s*\d+,\s*\d+(,\s*\d+)?/)?.[0].split(',').map((numStr, idx) => (
                        <div key={idx} className="flex items-center gap-1 md:gap-2">
                          <div className="bg-stone-900 border md:border-2 border-emerald-500 text-emerald-400 font-mono text-base md:text-2xl font-black w-10 h-10 md:w-16 md:h-16 flex flex-col justify-center items-center relative">
                            <span className="text-[6px] md:text-[8px] text-stone-500 absolute top-0.5 left-0.5 md:top-1 md:left-1">A_{idx + 1}</span>
                            <span>{numStr.trim()}</span>
                          </div>
                          <span className="text-emerald-500 font-black text-sm md:text-xl">➔</span>
                        </div>
                      ))}

                      <div className="bg-stone-900 border-2 md:border-4 border-dashed border-amber-400 text-amber-400 font-mono text-base md:text-2xl font-black w-10 h-10 md:w-16 md:h-16 flex flex-col justify-center items-center animate-bounce relative">
                        <span className="text-[6px] md:text-[8px] text-amber-500 absolute top-0.5 left-0.5 md:top-1 md:left-1">TARGET</span>
                        <span>{playerAnswer ? playerAnswer : "?"}</span>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-6 max-w-md mx-auto space-y-4">
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={playerAnswer}
                          onChange={(e) => setPlayerAnswer(e.target.value)}
                          placeholder="INPUT ANGKA..."
                          className="border-2 md:border-4 border-black p-2 md:p-3 bg-white grow font-black font-mono text-center focus:outline-none focus:bg-emerald-50 text-sm md:text-lg shadow-inner placeholder:text-stone-300 tracking-widest"
                          onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                        />
                        <button
                          type="button"
                          onClick={checkAnswer}
                          className="bg-emerald-400 text-black px-4 md:px-6 font-black font-mono uppercase tracking-wider border-2 md:border-4 border-black hover:bg-emerald-300 active:translate-y-0.5 transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] text-[10px] md:text-xs cursor-pointer"
                        >
                          ⚡ SUNTIKKAN
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAMPILAN TAHAP 4 CYBER CONSOLE */}
                {currentStage === 4 && activeQuestion && (
                  <div className="my-4 p-4 md:p-5 bg-stone-900 border-2 md:border-4 border-black text-left shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative">
                    <div className="text-[8px] md:text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-2 md:mb-3 flex items-center gap-1.5 md:gap-2">
                      <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-cyan-400 rounded-full animate-ping" />
                      MODUL DEKRIPSI // PORT_A47 AKTIF
                    </div>
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={playerAnswer}
                          onChange={(e) => setPlayerAnswer(e.target.value)}
                          placeholder="Ketik KAPITAL..."
                          className="border-2 md:border-4 border-black p-2 md:p-3 bg-stone-950 text-cyan-400 font-black font-mono text-sm md:text-lg grow focus:outline-none uppercase tracking-widest placeholder:text-stone-700"
                          onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                        />
                        <button
                          type="button"
                          onClick={checkAnswer}
                          className="bg-cyan-400 text-black px-4 md:px-8 py-2 md:py-3 font-black font-mono uppercase tracking-wider border-2 md:border-4 border-black hover:bg-cyan-300 active:translate-y-0.5 transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] text-[10px] md:text-xs cursor-pointer"
                        >
                          🔓 PECAHKAN
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* BOTTOM INFO ACTION HINTS */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4 pt-3 md:pt-4 border-t-2 border-stone-200 mt-4">
                  <div className="text-[9px] md:text-xs text-blue-600 font-bold uppercase tracking-tight max-w-xl">
                    💡 Format Pengisian: Isilah kolom jawaban dengan huruf KAPITAL penuh. Periksa kembali seluruh jawabanmu sebelum menekan tombol lanjut di akhir tahap!
                  </div>
                </div>

              </div>

              {/* VISUALISASI TARGET STRUKTUR TAHAP 6 */}
              {currentStage === 6 && activeQuestion && (
                <div className="border-2 md:border-4 border-black bg-white p-3 md:p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-mono text-[10px] md:text-xs text-stone-900 w-full overflow-hidden mt-4">
                  <h3 className="text-[10px] md:text-xs font-black uppercase tracking-tight mb-2 text-stone-500">
                    📋 TARGET BENTUK VISUAL (SOAL {activeQuestion.qNum})
                  </h3>
                  <p className="font-bold mb-3 text-stone-700 bg-stone-100 p-1.5 border border-black border-dashed leading-tight">
                    {activeQuestion.qNum === 1 && "💡 Target: Urutkan murni dari nilai TERKECIL ke TERBESAR."}
                    {activeQuestion.qNum === 2 && "💡 Target: Kelompokkan GANJIL di kiri (urut naik) dan GENAP di kanan (urut naik)."}
                    {activeQuestion.qNum === 3 && "💡 Target: Urutkan berdasarkan abjad HURUF (A-C), lalu angka di belakangnya."}
                    {activeQuestion.qNum === 4 && "💡 Target: Bentuk Formasi Gunung (Kiri mengurut naik, Kanan mengurut turun, terbesar di tengah)."}
                    {activeQuestion.qNum === 5 && "💡 Target: Urutkan berdasarkan angka SATUAN. Satuan [0-4] di kiri, Satuan [5-9] di kanan."}
                  </p>

                  <div className="flex justify-start md:justify-center items-end gap-0.5 bg-stone-50 p-2 border-2 border-black min-h-25 overflow-x-auto w-full">
                    {activeQuestion.qNum === 1 && [10, 20, 30, 40, 50, 60, 70, 80, 90, 99].map((val) => (
                      <div key={val} style={{ height: `${20 + (val * 0.7)}px` }} className="flex-1 min-w-3.75 bg-emerald-200 border border-black flex flex-col justify-end pb-1 items-center font-black text-[6px] md:text-[8px] select-none">{val}</div>
                    ))}
                    {activeQuestion.qNum === 2 && [11, 33, 55, 77, 89, 93, 12, 24, 46, 68, 70, 82].map((val, i) => (
                      <div key={val} style={{ height: `${20 + (val * 0.7)}px` }} className={`flex-1 min-w-3.75 border border-black flex flex-col justify-between items-center py-0.5 md:py-1 font-black text-[6px] md:text-[7px] select-none ${i < 6 ? 'bg-purple-200' : 'bg-blue-200'}`}><span>{val}</span></div>
                    ))}
                    {activeQuestion.qNum === 3 && ['A2', 'A5', 'A9', 'B1', 'B4', 'B8', 'C3', 'C6', 'C7', 'C9'].map((val, i) => (
                      <div key={val} style={{ height: `${30 + (i * 6)}px` }} className="flex-1 min-w-3.75 bg-amber-200 border border-black flex flex-col justify-end pb-1 items-center font-black text-[6px] md:text-[8px] select-none">{val}</div>
                    ))}
                    {activeQuestion.qNum === 4 && [15, 30, 45, 65, 80, 98, 85, 70, 50, 35, 20].map((val) => (
                      <div key={val} style={{ height: `${20 + (val * 0.7)}px` }} className="flex-1 min-w-3.75 bg-teal-200 border border-black flex flex-col justify-end pb-1 items-center font-black text-[6px] md:text-[8px] select-none">{val}</div>
                    ))}
                    {activeQuestion.qNum === 5 && [10, 32, 44, 71, 83, 94, 25, 37, 56, 68, 79, 85].map((val, i) => (
                      <div key={i} style={{ height: `${20 + (val * 0.7)}px` }} className={`flex-1 min-w-3.75 border border-black flex flex-col justify-between items-center py-0.5 font-black text-[6px] md:text-[7px] select-none ${i < 6 ? 'bg-rose-200' : 'bg-orange-200'}`}><span>{val}</span></div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 🚨 RETRO MODAL: JENDELA POP-UP KONFIRMASI KUNCI TAHAP GURU                 */}
          {/* ========================================================================= */}
          {showStageConfirmPopup && (
            <div className="fixed inset-0 bg-stone-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white border-4 border-black p-5 md:p-6 max-w-sm w-full text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-4">
                <div className="w-12 h-12 bg-amber-300 border-2 border-black rounded-full flex items-center justify-center text-xl font-black mx-auto animate-pulse">
                  ⚠️
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-tight text-stone-900">Konfirmasi Perpindahan</h3>
                  <p className="text-[11px] md:text-xs font-bold text-stone-500 uppercase leading-relaxed mt-1">
                    Akan masuk ke tahap selanjutnya, periksa jawaban lagi atau lanjut?
                  </p>
                </div>
                <div className="bg-stone-50 border-2 border-black p-2 text-[10px] font-bold text-stone-600 uppercase">
                  📌 Catatan: Begitu kamu menekan tombol LANJUT, nilai dari Tahap {currentStage} akan dikunci mati dan tidak bisa diubah kembali!
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setQuestionsAnsweredInStage(0); // 🌟 Reset kembali ke Soal Pertama Tahap berjalan!
                      setShowStageConfirmPopup(false);
                    }}
                    className="bg-stone-200 hover:bg-stone-300 text-black border-2 border-black p-2 font-black uppercase text-[10px] tracking-wider cursor-pointer"
                  >
                    🔍 Periksa Lagi
                  </button>
                  <button
                    type="button"
                    onClick={eksekusiPindahTahapResmi}
                    className="bg-blue-600 hover:bg-blue-700 text-white border-2 border-black p-2 font-black uppercase text-[10px] tracking-wider shadow-[2px_2px_0px_rgba(0,0,0,1)] cursor-pointer"
                  >
                    🚀 Lanjut
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}