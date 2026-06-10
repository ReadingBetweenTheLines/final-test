import { useState, useRef, useEffect } from 'react';

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

  // FIX UTAMA: Kunci tipe khusus Tahap 6 langsung ke 'INSERTION-SORT' agar tidak terlempar null acak
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

    // 🎲 POOL DATA ACAK UNTUK VARIASI MASAL KESULITAN 1 (ANTI-CONTEK)
    const varNames = ['perangkat', 'simpul', 'klien', 'muatan', 'paket', 'terminal', 'port'];
    const systems = ['UTAMA', 'TEPI', 'AKAR', 'HOST', 'TAUTAN', 'GERBANG', 'ZONA'];
    const alerts = ['AWAS', 'PERINGATAN', 'INFO', 'SINKRON', 'LOG', 'GAGAL', 'LULUS'];
    const responses = ['SUKSES', 'DIIZINKAN', 'DITOLAK', 'HABIS_WAKTU', 'ONLINE', 'OFFLINE'];

    const v1 = varNames[Math.floor(Math.random() * varNames.length)];
    const sys = systems[Math.floor(Math.random() * systems.length)];
    const alr = alerts[Math.floor(Math.random() * alerts.length)];

    // 🔌 GENERATE NILAI ACAK SAKLAR UNTUK KESULITAN 2
    const inputA = Math.random() > 0.5 ? 1 : 0;
    const inputB = Math.random() > 0.5 ? 1 : 0;
    const inputC = Math.random() > 0.5 ? 1 : 0;

    // =========================================================================
    // 🔥 KESULITAN 1: ANALISIS KODE SEMU (SOAL 1 - 5)
    // =========================================================================

    // --- SOAL 1: ALUR INPUT & OUTPUT STRINGS ---
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

    // --- SOAL 2: OPERASI MATEMATIKA VARIABEL BERANTAI ---
    else if (questionIndex === 1) {
      const baseNum = Math.floor(Math.random() * 6) + 4;       // 4 s.d 9
      const multiplier = Math.floor(Math.random() * 3) + 2;    // 2 s.d 4
      const adjuster = Math.floor(Math.random() * 4) + 1;      // 1 s.d 4
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

    // --- SOAL 3: PERCABANGAN LOGIKA TUNGGAL (IF-ELSE) ---
    else if (questionIndex === 2) {
      const limit = Math.floor(Math.random() * 4) * 10 + 60;   // 60, 70, 80, 90
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

    // --- SOAL 4: KONDISI BERLAPIS / SEKUENSIAL (3 Lapisan Sieve IF) ---
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

    // --- SOAL 5: GERBANG LOGIKA GABUNGAN RELEVAN ---
    else if (questionIndex === 4) {
      const condA = Math.random() > 0.5;
      const condB = Math.random() > 0.5;
      const strA = condA ? "VALID" : "KEDALUWARSA";
      const strB = condB ? "DIIZINKAN" : "DITOLAK";
      const isGateAnd = Math.random() > 0.5;
      const gateOperator = isGateAnd ? "DAN" : "ATAU";
      const evalCondition = isGateAnd ? (condA && condB) : (condA || condB);
      const finalAns = evalCondition ? "AKSES_DIBERIKAN" : "AKSES_DIBLOKIR";

      return {
        type,
        qNum: currentQuestionNum,
        question: `[SOAL ${currentQuestionNum} - PENIMPAAN PROTOKOL KEAMANAN] Evaluasi gerbang logika majemuk (${gateOperator}). Perhatikan dengan seksama syarat penilaian pada baris ke-3 untuk menentukan status akses akhir di sistem!`,
        codeLines: [
          `1: status_token = "${strA}"`,
          `2: izin_masuk = "${strB}"`,
          `3: JIKA status_token == "VALID" ${gateOperator} izin_masuk == "DIIZINKAN" MAKA`,
          `4:   hasil_otorisasi = "AKSES_DIBERIKAN"`,
          `5: LAINNYA`,
          `6:   hasil_otorisasi = "AKSES_DIBLOKIR"`,
          `7: AKHIR_JIKA`,
          `8: CETAK hasil_otorisasi`
        ],
        answer: finalAns
      };
    }

    // =========================================================================
    // 📊 KESULITAN 2: SAKLAR LISTRIK PROGRESIF MULTI-SWITCH (SOAL 6 - 10)
    // =========================================================================

    // --- SOAL 6: 2 SAKLAR STANDARD (SERI / AND) ---
    else if (questionIndex === 5) {
      const g1Correct = (inputA === 1 && inputB === 1) ? 1 : 0;

      return {
        type,
        qNum: currentQuestionNum,
        mode: 'interactive-circuit',
        question: `[SOAL ${currentQuestionNum} - KONSOL LALU LINTAS DAYA] Kelistrikan ruang jaringan menggunakan sistem SERI. Analisis status Saklar A DAN Saklar B untuk menentukan apakah lampu utama berhasil menyala!`,
        circuitType: 'LIGHT-AND',
        inputs: { A: inputA, B: inputB },
        correctGates: { G1: g1Correct }
      };
    }

    // --- SOAL 7: 2 SAKLAR DENGAN INVERSI (NOT + SERI) ---
    else if (questionIndex === 6) {
      const realA = inputA === 1 ? 0 : 1; // NOT A
      const g1Correct = (realA === 1 && inputB === 1) ? 1 : 0;

      return {
        type,
        qNum: currentQuestionNum,
        mode: 'interactive-circuit',
        question: `[SOAL ${currentQuestionNum} - SAKLAR PENGAMAN OTOMATIS] Sistem mendeteksi komponen pembalik nilai (Pembalik Data) pada Saklar A. Nilai Saklar A akan berbalik (1 jadi 0, 0 jadi 1) sebelum dialirkan secara SERI dengan Saklar B!`,
        circuitType: 'LIGHT-INVERT-AND',
        inputs: { A: inputA, B: inputB },
        correctGates: { G1: g1Correct }
      };
    }

    // --- SOAL 8: 3 SAKLAR GABUNGAN (SERI + PARALEL) ---
    else if (questionIndex === 7) {
      const jalurSeri = (inputA === 1 && inputB === 1) ? 1 : 0;
      const g1Correct = (jalurSeri === 1 || inputC === 1) ? 1 : 0;

      return {
        type,
        qNum: currentQuestionNum,
        mode: 'interactive-circuit',
        question: `[SOAL ${currentQuestionNum} - JARINGAN STRUKTUR CAMPURAN] Tantangan 3 Saklar! Aliran listrik atas diatur secara SERI (Saklar A DAN B), lalu digabungkan secara PARALEL (ATAU) dengan jalur bawah mandiri (Saklar C).`,
        circuitType: 'LIGHT-MIX-3WAY',
        inputs: { A: inputA, B: inputB, C: inputC },
        correctGates: { G1: g1Correct }
      };
    }

    // --- SOAL 9: 3 SAKLAR KOMPLEKS + DOUBLE INVERSI ---
    else if (questionIndex === 8) {
      const realA = inputA === 1 ? 0 : 1; // NOT A
      const realC = inputC === 1 ? 0 : 1; // NOT C
      const jalurSeri = (realA === 1 && inputB === 1) ? 1 : 0;
      const g1Correct = (jalurSeri === 1 || realC === 1) ? 1 : 0;

      return {
        type,
        qNum: currentQuestionNum,
        mode: 'interactive-circuit',
        question: `[SOAL ${currentQuestionNum} - DISTRIBUSI DAYA TINGKAT LANJUT] Lacak perputaran daya! Jalur atas memproses pembalikan Saklar A secara SERI dengan Saklar B. Jalur bawah memproses pembalikan Saklar C. Kedua jalur digabung secara PARALEL!`,
        circuitType: 'LIGHT-INVERT-MIX',
        inputs: { A: inputA, B: inputB, C: inputC },
        correctGates: { G1: g1Correct }
      };
    }

    // --- SOAL 10: MINI BOSS: 4 SAKLAR MATRIKS GANDA (DOUBLE SERI + PARALEL) ---
    else if (questionIndex === 9) {
      const inputD = Math.random() > 0.5 ? 1 : 0;

      const jalurAtas = (inputA === 1 && inputB === 1) ? 1 : 0; // A AND B
      const jalurBawah = (inputC === 1 && inputD === 1) ? 1 : 0; // C AND D
      const g1Correct = (jalurAtas === 1 || jalurBawah === 1) ? 1 : 0; // Atas OR Bawah

      return {
        type,
        qNum: currentQuestionNum,
        mode: 'interactive-circuit',
        question: `[SOAL ${currentQuestionNum} - UJIAN BOSS: MATRIKS EMPAT SAKLAR] Ujian puncak kelistrikan! Sistem membagi aliran jadi dua cabang utama: Jalur Atas diatur SERI (Saklar A DAN B), Jalur Bawah juga diatur SERI (Saklar C DAN D). Keduanya bertemu di titik akhir secara PARALEL!`,
        circuitType: 'LIGHT-FINAL-BOSS-4WAY',
        inputs: { A: inputA, B: inputB, C: inputC, D: inputD },
        correctGates: { G1: g1Correct }
      };
    }
  }

  if (type === 'NUM-PATTERN') {
    const currentQuestionNum = questionIndex + 1;
    let textQuestion = "";
    let correctAnswer = "";

    // --- SOAL 1: LINEAR ASCENDING (Penjumlahan Tetap) ---
    if (questionIndex === 0) {
      const start = Math.floor(Math.random() * 20) + 5; 
      const step = Math.floor(Math.random() * 5) + 3;   

      const n1 = start;
      const n2 = n1 + step;
      const n3 = n2 + step;
      const n4 = n3 + step;
      const ans = n4 + step;

      textQuestion = `[SOAL 1 - NAIK LINEAR] Optimasi kecepatan data! Tentukan angka berikutnya pada pola penambahan tetap ini: ${n1}, ${n2}, ${n3}, ${n4}, ___`;
      correctAnswer = ans.toString();
    }

    // --- SOAL 2: GEOMETRIC PROGRESSION (Perkalian Tetap) ---
    else if (questionIndex === 1) {
      const start = Math.floor(Math.random() * 4) + 2; 

      const n1 = start;
      const n2 = n1 * 2; 
      const n3 = n2 * 2;
      const n4 = n3 * 2;
      const ans = n4 * 2;

      textQuestion = `[SOAL 2 - DERET GEOMETRI] Penggandaan beban memori! Analisis faktor kelipatan tetap untuk menentukan muatan berikutnya: ${n1}, ${n2}, ${n3}, ${n4}, ___`;
      correctAnswer = ans.toString();
    }

    // --- SOAL 3: LINEAR DESCENDING (Pengurangan Tetap) ---
    else if (questionIndex === 2) {
      const start = Math.floor(Math.random() * 30) + 60; 
      const step = Math.floor(Math.random() * 4) + 5;   

      const n1 = start;
      const n2 = n1 - step;
      const n3 = n2 - step;
      const n4 = n3 - step;
      const ans = n4 - step;

      textQuestion = `[SOAL 3 - TURUN LINEAR] Pelepasan ruang penyimpanan! Analisis pengurangan tetap secara mundur untuk menebak angka berikutnya: ${n1}, ${n2}, ${n3}, ${n4}, ___`;
      correctAnswer = ans.toString();
    }

    // --- SOAL 4: ALTERNATING SIGNS (Operasi Selang-Seling) ---
    else if (questionIndex === 3) {
      const start = Math.floor(Math.random() * 20) + 10; 
      const up = Math.floor(Math.random() * 3) + 4;      
      const down = Math.floor(Math.random() * 2) + 2;    

      const n1 = start;
      const n2 = n1 + up;
      const n3 = n2 - down;
      const n4 = n3 + up;
      const n5 = n4 - down;
      const ans = n5 + up; 

      textQuestion = `[SOAL 4 - POLA SELANG-SELING] Sistem mendeteksi dua perintah perhitungan (+ / -) yang berjalan bergantian! Tebak angka selanjutnya: ${n1}, ${n2}, ${n3}, ${n4}, ${n5}, ___`;
      correctAnswer = ans.toString();
    }

    // --- SOAL 5: DOUBLE AND ADJUST (Mini Boss Level) ---
    else if (questionIndex === 4) {
      const start = Math.floor(Math.random() * 4) + 2; 
      const isPlus = Math.random() > 0.5;              
      const adjust = isPlus ? 1 : -1;

      const n1 = start;
      const n2 = (n1 * 2) + adjust;
      const n3 = (n2 * 2) + adjust;
      const n4 = (n3 * 2) + adjust;
      const ans = (n4 * 2) + adjust;

      const hintText = isPlus ? "dikali 2 lalu ditambah 1" : "dikali 2 lalu dikurangi 1";
      textQuestion = `[SOAL 5 - UJIAN BOSS: GANDAKAN DAN SESUAIKAN] Titik perulangan akhir! Setiap blok mematuhi aturan berantai [ ${hintText} ]. Tentukan isi angka pada blok ujung: ${n1}, ${n2}, ${n3}, ${n4}, ___`;
      correctAnswer = ans.toString();
    }

    return {
      type,
      qNum: currentQuestionNum,
      question: textQuestion,
      answer: correctAnswer
    };
  }

  if (type === 'CAESAR-CIPHER') {
    const currentQuestionNum = questionIndex + 1;
    // 🟢 HANYA TAHAP 4 YANG MENGGUNAKAN LOGIC INDEX BERPASANGAN
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
    // Definisi Kuantitas Balok sesuai Formasi Baru
    const blockCounts = [15, 15, 18, 18, 20];
    const gridSize = blockCounts[questionIndex] || 15;
    const currentQuestionNum = questionIndex + 1;

    let scrambled = [];
    let textQuestion = "";

    // --- SOAL 3: ALFANUMERIK (HURUF & ANGKA) ---
    if (questionIndex === 2) {
      const letters = ['A', 'B', 'C'];
      let pool = [];
      // Buat kombinasi unik seperti A1, A2, B1, B2...
      letters.forEach(l => {
        for (let n = 1; n <= 9; n++) pool.push(`${l}${n}`);
      });

      // Ambil acak sesuai kuantitas (18 balok)
      while (scrambled.length < gridSize) {
        const randIdx = Math.floor(Math.random() * pool.length);
        const code = pool.splice(randIdx, 1)[0];
        if (!scrambled.includes(code)) scrambled.push(code);
      }

      textQuestion = `[SOAL 3 - KODE ALFANUMERIK] Seret dan susun 18 blok rak penyimpan data di bawah berdasarkan abjad HURUF terlebih dahulu (A s.d C), lalu diikuti URUTAN ANGKA di belakangnya (Contoh: A1, A2, B1, B2)!`;
    }
    // --- SOAL 1, 2, 4, 5: ANGKA PULUHAN ACAK UNIK ---
    else {
      while (scrambled.length < gridSize) {
        const randomValue = Math.floor(Math.random() * 90) + 10; // 10 s.d 99
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

    // Set batas toleransi langkah efektif yang menantang
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
  const [currentStage, setCurrentStage] = useState(1);
  const [questionsAnsweredInStage, setQuestionsAnsweredInStage] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState(() => generateQuestion(1, 0));
  const [playerAnswer, setPlayerAnswer] = useState('');
  const [binarySwitches, setBinarySwitches] = useState([0, 0, 0, 0, 0]);
  const [currentArrayData, setCurrentArrayData] = useState([]);
  const [studentMoves, setStudentMoves] = useState(0);
  const [draggedOverIdx, setDraggedOverIdx] = useState(null);
  const [circuitGates, setCircuitGates] = useState({ G1: null, G2: null, G3: null });

  const [score, setScore] = useState(0);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);

  const [feedback, setFeedback] = useState({ type: '', msg: '' });
  const [isExamComplete, setIsExamComplete] = useState(false);
  const [gameLogs, setGameLogs] = useState(['Server Ujian Aktif. Menginisialisasi komponen logika secara dinamis.']);

  const logEndRef = useRef(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [gameLogs]);

  // FIX SINKRONISASI: Menjamin array ter-load instan saat bypass dev atau perpindahan stage otomatis terpicu
  useEffect(() => {
    if (currentStage === 6 && (!activeQuestion || activeQuestion.type !== 'INSERTION-SORT')) {
      const q = generateQuestion(6, questionsAnsweredInStage);
      const tid = setTimeout(() => {
        setActiveQuestion(q);
        if (q && q.initialArray) {
          setCurrentArrayData([...q.initialArray]);
        }
      }, 0);
      return () => clearTimeout(tid);
    }
  }, [currentStage, activeQuestion, questionsAnsweredInStage]);

  const logEvent = (message) => {
    setGameLogs((prev) => [...prev, message]);
  };

  const checkAnswer = () => {
    if (!activeQuestion || isExamComplete || currentStage === 5 || currentStage === 6) return;

    if (currentStage === 1) {
      if (activeQuestion.mode === 'theory' || activeQuestion.mode === 'text') {
        const finalSubmission = playerAnswer.trim().toUpperCase();
        const correctTarget = activeQuestion.answer.trim().toUpperCase();

        if (finalSubmission === correctTarget) {
          processCorrectAnswer();
        } else {
          logEvent(`❌ Salah! Jawaban tidak tepat. Soal otomatis diacak ulang.`);
          processIncorrectAnswer();
          setActiveQuestion(generateQuestion(1, questionsAnsweredInStage));
        }
        return;
      }

      if (activeQuestion.mode === 'switch') {
        const weights = [16, 8, 4, 2, 1];
        const calculatedDecimal = binarySwitches.reduce((acc, bit, idx) => acc + (bit * weights[idx]), 0);
        const isCorrect = calculatedDecimal === activeQuestion.targetNum;

        if (isCorrect) {
          processCorrectAnswer();
          setBinarySwitches([0, 0, 0, 0, 0]);
        } else {
          logEvent(`❌ Salah! Susunan saklar biner saat ini bernilai ${calculatedDecimal}. Soal otomatis diacak ulang.`);
          processIncorrectAnswer();
          setActiveQuestion(generateQuestion(1, questionsAnsweredInStage));
          setBinarySwitches([0, 0, 0, 0, 0]);
        }
        return;
      }
    }

    const finalSubmission = playerAnswer.trim().toUpperCase();
    const correctTarget = activeQuestion.answer.trim().toUpperCase();
    if (finalSubmission === correctTarget) {
      processCorrectAnswer();
    } else {
      processIncorrectAnswer();
    }
  };

  const handleGridCellClick = (rowIndex, colIndex) => {
    if (currentStage !== 5 || !activeQuestion) return;

    const isCorrectGridClick = activeQuestion.errorType === 'BARIS'
      ? rowIndex === activeQuestion.errorIndex
      : colIndex === activeQuestion.errorIndex;

    if (isCorrectGridClick) {
      logEvent(`🟢 Tepat! Koordinat lokasi [Baris B${activeQuestion.gridSize - rowIndex}, Kolom K${colIndex + 1}] terbukti bermasalah.`);
      processCorrectAnswer();
    } else {
      logEvent(`❌ Salah! Deteksi koordinat meleset. Sistem mengacak ulang susunan grid sel data.`);
      processIncorrectAnswer();
      setActiveQuestion(generateQuestion(5, questionsAnsweredInStage));
    }
  };

  const processCorrectAnswer = () => {
    setScore((prev) => prev + 1);
    setFeedback({ type: 'success', msg: 'Luar biasa! Analisis jawaban kamu benar.' });

    // 🟢 PERBAIKAN UTAMA: Mengunci batas maksimal soal di setiap Stage secara presisi
    let maxQuestionsForThisStage = 3; 

    if (currentStage === 1) {
      maxQuestionsForThisStage = 9;  // Tahap 1: 9 Soal biner
    } else if (currentStage === 2) {
      maxQuestionsForThisStage = 10; // Tahap 2: 5 Soal Kode Semu + 5 Soal Sirkuit Interaktif
    } else if (currentStage === 4) {
      maxQuestionsForThisStage = 10; // Tahap 4: 10 Soal Sandi Kriptografi
    } else if (currentStage === 3 || currentStage === 5 || currentStage === 6) {
      maxQuestionsForThisStage = 5;  // Tahap 3, 5, dan 6: 5 Soal bertahap
    }

    const nextCount = questionsAnsweredInStage + 1;

    if (nextCount < maxQuestionsForThisStage) {
      setQuestionsAnsweredInStage(nextCount);
      setPlayerAnswer('');

      const nextQ = generateQuestion(currentStage, nextCount);
      setActiveQuestion(nextQ);

      if (currentStage === 6) {
        setCurrentArrayData(nextQ ? [...nextQ.initialArray] : []);
        setStudentMoves(0);
      }
    } else {
      // Jalur jika semua nomor di stage ini sudah habis dikerjakan
      if (currentStage === 6) {
        setIsExamComplete(true);
        setActiveQuestion(null);
        setPlayerAnswer('');
        setFeedback({ type: 'success', msg: '🎉 UJIAN SELESAI! Terminal berhasil menyimpan semua hasil kerjamu.' });
      } else {
        const nextStage = currentStage + 1;
        setCurrentStage(nextStage);
        setQuestionsAnsweredInStage(0);
        setPlayerAnswer('');
        setFeedback({ type: 'success', msg: `🚀 TAHAP SELESAI! Membuka akses baru menuju ${STAGE_CONFIG[nextStage].title}!` });
        logEvent(`Sistem: Berhasil melangkah maju ke Tahap ${nextStage}.`);

        const firstQOfNextStage = generateQuestion(nextStage, 0);
        setActiveQuestion(firstQOfNextStage);

        if (nextStage === 6) {
          setCurrentArrayData(firstQOfNextStage ? [...firstQOfNextStage.initialArray] : []);
          setStudentMoves(0);
        }
      }
    }
  };

  // 🟢 MEKANIK BARU: NATIVE DRAG & DROP INSERTION (SERET & SISIP)
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

    setCurrentArrayData(updatedArray);
    const newMovesCount = studentMoves + 1;
    setStudentMoves(newMovesCount);

    // --- PENILAIAN OTOMATIS STRUKTUR DATA ---
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
        logEvent(`👑 Sempurna! Kamu merapikan struktur Soal ${qNum} hanya dalam ${newMovesCount} langkah aksi.`);
        processCorrectAnswer();
      } else {
        logEvent(`⚠️ Cukup Baik! Tetapi gerakanmu kurang efisien (${newMovesCount} langkah). Pengurangan skor diterapkan.`);
        setIncorrectAttempts(prev => prev + 1);
        processCorrectAnswer();
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const processIncorrectAnswer = () => {
    setIncorrectAttempts((prev) => prev + 1);
    setFeedback({ type: 'error', msg: '❌ Logika keliru! Periksa kembali alur datanya dan coba lagi.' });
  };

  const skipQuestion = () => {
    if (!activeQuestion || isExamComplete) return;

    logEvent(`⏩ Konsol Dev: Memaksa bypass sistem, melompat dari Soal ${questionsAnsweredInStage + 1} ke tahap angka selanjutnya.`);

    processCorrectAnswer();
    setPlayerAnswer('');
    setFeedback({ type: '', msg: '' });
  };

  const shuffleCurrentQuestion = () => {
    if (!activeQuestion || isExamComplete) return;

    logEvent(`🔄 Fitur Acak Ulang: Mengganti dan merangkai data baru untuk penyegaran Soal ${questionsAnsweredInStage + 1}.`);

    const newVariation = generateQuestion(currentStage, questionsAnsweredInStage);
    setActiveQuestion(newVariation);

    setPlayerAnswer('');
    setFeedback({ type: '', msg: '' });

    if (currentStage === 6) {
      setCurrentArrayData(newVariation ? [...newVariation.initialArray] : []);
      setStudentMoves(0);
    }
  };

  const totalPossiblePoints = 44;

  return (
    <div className="min-h-screen bg-stone-100 p-6 font-mono text-stone-900 selection:bg-black selection:text-white">
      {/* HUD DASHBOARD */}
      <header className="border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-black uppercase tracking-wider">⚡ ALGORITHM TYCOON</h1>
        <div className="flex gap-4">
          <div className="bg-emerald-300 border-2 border-black px-4 py-2 font-black text-sm shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            🎯 SKOR: {score} / {totalPossiblePoints} POIN
          </div>
          <div className="bg-rose-300 border-2 border-black px-4 py-2 font-black text-sm shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            ⚠️ KESALAHAN: {incorrectAttempts}
          </div>
        </div>
      </header>

      {feedback.msg && (
        <div className={`p-3 mb-6 border-4 border-black font-bold uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${feedback.type === 'error' ? 'bg-rose-300' : 'bg-emerald-300'
          }`}>
          {feedback.msg}
        </div>
      )}

      {isExamComplete ? (
        <div className="border-4 border-black bg-white p-8 text-center max-w-2xl mx-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] my-12">
          <h2 className="text-4xl font-black text-emerald-600 uppercase tracking-tight mb-2">📊 HASIL EVALUASI UJIAN</h2>
          <p className="text-stone-600 font-bold mb-6 text-lg">Semua sesi operasi diamankan. Lembar kalkulasi skor berhasil diterbitkan.</p>
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
            <div className="bg-stone-900 text-yellow-400 p-4 border-4 border-black text-xl font-black">
              PENCAPAIAN SKOR: {score} / {totalPossiblePoints}
            </div>
            <div className="bg-stone-900 text-rose-400 p-4 border-4 border-black text-xl font-black">
              TOTAL SALAH: {incorrectAttempts}
            </div>
          </div>
          <div className="bg-yellow-300 text-black font-black border-4 border-black p-4 text-2xl uppercase shadow-[4px_4px_0px_rgba(0,0,0,1)] mb-6">
            PREDIKAT NILAI AKHIR: {Math.round((score / totalPossiblePoints) * 100)}%
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">

              <div className="bg-black text-white p-4 mb-4 border-2 border-black flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-wide">💼 {STAGE_CONFIG[currentStage].title}</h2>
                  <p className="text-xs text-stone-300 font-bold mt-0.5">{STAGE_CONFIG[currentStage].description}</p>
                </div>
                <div className="bg-blue-600 text-white border-2 border-white px-3 py-1 font-black text-xs uppercase shadow-[2px_2px_0px_rgba(255,255,255,1)] whitespace-nowrap">
                  PROGRES PENCAPAIAN: SOAL {questionsAnsweredInStage + 1} / {
                    currentStage === 1 ? 9 :
                      currentStage === 2 ? 10 :
                        currentStage === 4 ? 10 : 5
                  }
                </div>
              </div>

              {/* 📊 INTERAKTIF JALUR SERET & SISIP UNTUK TAHAP 6 (INSERTION SORT MURNI) */}
              {currentStage === 6 && currentArrayData.length > 0 && (
                <div className="my-6 w-full mx-auto bg-white border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center">
                  <div className="text-xs font-bold text-stone-500 uppercase mb-4 tracking-wider flex justify-between px-2">
                    <span>Tindakan Eksekusi: <strong className="text-blue-600">{studentMoves}</strong> kali geser</span>
                    <span>Batas Paling Efektif: <strong className="text-rose-600">{activeQuestion?.maxEffectiveMoves}</strong> langkah target</span>
                  </div>

                  <div className="flex justify-center items-end gap-1 bg-stone-100 p-4 border-4 border-black border-double min-h-50 w-full">
                    {currentArrayData.map((value, idx) => {
                      const isTargetHovered = draggedOverIdx === idx;

                      let numericWeight = typeof value === 'string'
                        ? (value.charCodeAt(0) - 50) * 10 + parseInt(value[1] || 0, 10) * 2
                        : value;

                      const heightStyle = { height: `${60 + (numericWeight * 1.2)}px` };

                      return (
                        <div
                          key={value}
                          className="flex flex-1 items-end relative"
                          onDragEnter={(e) => handleDragEnter(e, idx)}
                          onDragLeave={handleDragLeave}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, idx)}
                        >
                          {isTargetHovered && (
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-yellow-400 border-l-2 border-r-2 border-black border-dashed animate-pulse z-20 -ml-0.5" />
                          )}

                          <div
                            draggable
                            onDragStart={(e) => handleDragStart(e, idx)}
                            style={heightStyle}
                            className={`w-full border-2 border-black font-mono flex flex-col justify-between items-center py-2 transition-all duration-150 cursor-grab active:cursor-grabbing shadow-[1px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-1 select-none ${isTargetHovered
                              ? 'bg-amber-100 border-dashed opacity-80 scale-95'
                              : 'bg-orange-300 text-stone-900 hover:bg-orange-200'
                              }`}
                          >
                            <span className="text-[9px] font-black opacity-30">
                              {currentArrayData.length <= 15 ? `#${idx + 1}` : ''}
                            </span>

                            <span className={`font-black tracking-tighter ${currentArrayData.length > 20 ? 'text-xs' : 'text-sm'
                              }`}>
                              {value}
                            </span>

                            <span className="text-[9px] opacity-40">===</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* BOX KONSOL SOAL ACTIVE */}
              {currentStage !== 3 && activeQuestion && (
                <div className="border-4 border-black bg-stone-50 p-6 mb-6 shadow-inner relative">
                  <div className="absolute top-2 left-2 flex gap-1">
                    <span className="w-3 h-3 bg-red-500 rounded-full border border-black"></span>
                    <span className="w-3 h-3 bg-yellow-500 rounded-full border border-black"></span>
                    <span className="w-3 h-3 bg-green-500 rounded-full border border-black"></span>
                  </div>
                  <div className="text-right text-xs font-black text-stone-400 mb-2 uppercase tracking-widest">
                    Blok Kompilator Inti Aman
                  </div>

                  {currentStage === 2 ? (
                    <div className="space-y-4 mt-4">
                      <div className="text-base font-black leading-relaxed text-stone-800">
                        {activeQuestion?.question}
                      </div>

                      <div className="bg-stone-950 p-4 border-4 border-black shadow-inner relative overflow-hidden">
                        <div className="absolute top-1 right-2 text-[8px] font-mono text-stone-600 font-bold tracking-widest">IDE_KODE_SEMU</div>
                        <pre className="font-mono text-xs md:text-sm text-emerald-400 leading-relaxed whitespace-pre-wrap tracking-wide">
                          {activeQuestion?.codeLines?.map((line, index) => (
                            <div key={index} className="hover:bg-stone-900 px-1 py-0.5 rounded transition-colors">
                              {line}
                            </div>
                          ))}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <div className="text-base md:text-lg font-black leading-relaxed mt-4 mb-4">
                      {activeQuestion?.question}
                    </div>
                  )}

                  {/* RENDERING RETRO SWITCHES UNTUK TAHAP 1 */}
                  {currentStage === 1 && activeQuestion?.mode === 'switch' && (
                    <div className="my-6 max-w-md mx-auto bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center">
                      <div className="grid grid-cols-5 gap-2 mb-4">
                        {[16, 8, 4, 2, 1].map((weight, idx) => (
                          <div key={idx} className="flex flex-col items-center">
                            <span className="text-xs text-stone-400 font-bold mb-1">[{weight}]</span>
                            <button
                              type="button"
                              onClick={() => {
                                setBinarySwitches(prev => {
                                  const updated = [...prev];
                                  updated[idx] = updated[idx] === 0 ? 1 : 0;
                                  return updated;
                                });
                              }}
                              className={`w-12 h-16 border-4 border-black font-mono text-xl font-black flex items-center justify-center transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 select-none cursor-pointer ${binarySwitches[idx] === 1
                                ? 'bg-emerald-400 text-black translate-y-0.5 shadow-none'
                                : 'bg-stone-200 text-stone-600'
                                }`}
                            >
                              {binarySwitches[idx]}
                            </button>
                            <span className="text-[10px] text-stone-500 font-bold mt-1 uppercase">
                              {binarySwitches[idx] === 1 ? 'NYALA' : 'MATI'}
                            </span>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={checkAnswer}
                        className="w-full mt-2 bg-black text-white p-2 font-black uppercase text-xs tracking-wider border-2 border-black hover:bg-stone-800 shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                      >
                        KIRIM KONFIGURASI SAKLAR
                      </button>
                    </div>
                  )}

                  {/* MATRIKS GRID PERSEGI PROGRESAL */}
                  {currentStage === 5 && activeQuestion?.gridData && (
                    <div className="my-6 overflow-x-auto p-2 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <table className="mx-auto font-mono text-sm font-black border-collapse">
                        <thead>
                          <tr>
                            <th className="p-1 text-stone-400 text-xs px-2"></th>
                            {Array.from({ length: activeQuestion.gridSize }).map((_, colIdx) => (
                              <th key={colIdx} className="p-1 bg-stone-100 border border-black text-xs min-w-10">
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
                                <td className="p-1 bg-stone-100 border border-black text-xs text-center font-bold px-2">B{labelBaris}</td>
                                {rowArr.map((cellValue, colIndex) => (
                                  <td key={colIndex} className="p-0 border border-black">
                                    <button
                                      type="button"
                                      onClick={() => handleGridCellClick(rowIndex, colIndex)}
                                      className={`w-full h-full p-3 text-center font-mono text-base font-extrabold transition-all cursor-pointer select-none active:scale-95 ${cellValue === 1
                                        ? 'bg-stone-900 text-yellow-300 hover:bg-stone-800'
                                        : 'bg-white text-stone-800 hover:bg-stone-50'
                                        }`}
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

              {/* ========================================================================= */}
              {/* 📊 INTERFACES INTERAKTIF SAKLAR LAMPU MULTI-SWITCH (SOAL 6 - 10)          */}
              {/* ========================================================================= */}
              {currentStage === 2 && activeQuestion?.mode === 'interactive-circuit' && (
                <div className="my-6 p-6 bg-stone-950 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center relative rounded-lg">
                  
                  <div className="max-w-md mx-auto bg-stone-900 p-6 border-2 border-stone-800 rounded-lg font-mono text-white space-y-6">
                    
                    {/* PANEL REGISTRI SAKLAR AKTIF (MENDUKUNG HINGGA 4 SAKLAR) */}
                    <div className="flex flex-wrap justify-center gap-3">
                      {activeQuestion.inputs.A !== undefined && (
                        <div className="bg-stone-950 p-2 border border-stone-700 rounded text-center min-w-20 grow">
                          <span className="text-stone-500 font-bold text-[9px] block mb-1">🔌 SAKLAR A</span>
                          <span className={`text-xs font-black px-2 py-0.5 rounded ${activeQuestion.inputs.A === 1 ? 'bg-emerald-400 text-black' : 'bg-stone-800 text-stone-400'}`}>
                            {activeQuestion.inputs.A === 1 ? "AKTIF (1)" : "MATI (0)"}
                          </span>
                        </div>
                      )}
                      {activeQuestion.inputs.B !== undefined && (
                        <div className="bg-stone-950 p-2 border border-stone-700 rounded text-center min-w-20 grow">
                          <span className="text-stone-500 font-bold text-[9px] block mb-1">🔌 SAKLAR B</span>
                          <span className={`text-xs font-black px-2 py-0.5 rounded ${activeQuestion.inputs.B === 1 ? 'bg-emerald-400 text-black' : 'bg-stone-800 text-stone-400'}`}>
                            {activeQuestion.inputs.B === 1 ? "AKTIF (1)" : "MATI (0)"}
                          </span>
                        </div>
                      )}
                      {activeQuestion.inputs.C !== undefined && (
                        <div className="bg-stone-950 p-2 border border-stone-700 rounded text-center min-w-20 grow">
                          <span className="text-stone-500 font-bold text-[9px] block mb-1">🔌 SAKLAR C</span>
                          <span className={`text-xs font-black px-2 py-0.5 rounded ${activeQuestion.inputs.C === 1 ? 'bg-emerald-400 text-black' : 'bg-stone-800 text-stone-400'}`}>
                            {activeQuestion.inputs.C === 1 ? "AKTIF (1)" : "MATI (0)"}
                          </span>
                        </div>
                      )}
                      {activeQuestion.inputs.D !== undefined && (
                        <div className="bg-stone-950 p-2 border border-stone-700 rounded text-center min-w-20 grow">
                          <span className="text-stone-500 font-bold text-[9px] block mb-1">🔌 SAKLAR D</span>
                          <span className={`text-xs font-black px-2 py-0.5 rounded ${activeQuestion.inputs.D === 1 ? 'bg-emerald-400 text-black' : 'bg-stone-800 text-stone-400'}`}>
                            {activeQuestion.inputs.D === 1 ? "AKTIF (1)" : "MATI (0)"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* KOTAK RUMUS BAHASA INDONESIA (LOGIKA MENINGKAT DI SETIAP NOMOR) */}
                    <div className="bg-stone-950 p-3 border border-amber-500/20 rounded text-left text-xs space-y-2">
                      <span className="text-amber-400 font-black block text-[10px] uppercase tracking-wider">📋 PANDUAN ATURAN ALIRAN SISTEM:</span>
                      
                      {activeQuestion.circuitType === 'LIGHT-AND' && (
                        <p className="text-stone-300 leading-relaxed">**Aturan Seri (DAN):** Listrik hanya mengalir jika Saklar A **DAN** Saklar B dua-duanya berada di posisi **AKTIF (1)**.</p>
                      )}
                      {activeQuestion.circuitType === 'LIGHT-INVERT-AND' && (
                        <p className="text-stone-300 leading-relaxed">**Aturan Inversi Seri:** Balikkan dulu nilai status Saklar A (1 jadi 0, 0 jadi 1). Lalu operasikan hasil hitungan baru itu secara **SERI (DAN)** dengan letak Saklar B.</p>
                      )}
                      {activeQuestion.circuitType === 'LIGHT-MIX-3WAY' && (
                        <p className="text-stone-300 leading-relaxed">**Aturan Perpaduan:** Nilai hitungan **SERI (DAN)** antara letak Saklar A & B. Jika hasilnya siap, rangkaikan perpaduan itu secara **PARALEL (ATAU)** dengan posisi Saklar C (Lampu akan terang apabila minimal salah satu jalur bernilai 1).</p>
                      )}
                      {activeQuestion.circuitType === 'LIGHT-INVERT-MIX' && (
                        <p className="text-stone-300 leading-relaxed">**Aturan Inversi Gabungan:** Tukar putaran pada letak Saklar A, lalu satukan memakai **SERI (DAN)** bersama kedudukan Saklar B. Di sisi berbeda, tukar pula nilai Saklar C. Terakhir, gabungkan kedua jalur tadi memanfaatkan operasi **PARALEL (ATAU)**.</p>
                      )}
                      {activeQuestion.circuitType === 'LIGHT-FINAL-BOSS-4WAY' && (
                        <p className="text-stone-300 leading-relaxed">**Aturan Ujian Empat Saklar Bos:** Kerjakan perpaduan Jalur Atas (Saklar A **SERI** B). Berikutnya, kerjakan perpaduan Jalur Bawah (Saklar C **SERI** D). Lampu induk terakhir akan **MENYALA (1)** asalkan perhitungan antara Jalur Atas **ATAU** Jalur Bawah mempunyai arus senilai 1.</p>
                      )}
                    </div>

                    {/* INTERAKTIF OUTPUT AKHIR */}
                    <div className="bg-stone-950 p-4 border border-stone-800 rounded-md text-center">
                      <span className="text-[10px] text-stone-400 font-black block mb-2">STATUS INDIKATOR LAMPU UTAMA (G1)</span>
                      <button
                        type="button"
                        onClick={() => setCircuitGates(prev => ({ ...prev, G1: prev.G1 === null ? 0 : (prev.G1 === 0 ? 1 : null) }))}
                        className={`w-full py-3 text-sm font-black border-4 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all ${
                          circuitGates.G1 === null ? 'bg-stone-700 text-stone-300' : (circuitGates.G1 === 1 ? 'bg-yellow-400 text-black' : 'bg-rose-500 text-white')
                        }`}
                      >
                        {circuitGates.G1 === null ? "💡 KLIK: JAWAB STATUS LAMPU" : (circuitGates.G1 === 1 ? "💡 LAMPU MENYALA (1)" : "🔌 LAMPU MATI (0)")}
                      </button>
                    </div>

                  </div>

                  {/* TOMBOL VERIFIKASI */}
                  <div className="mt-6 max-w-xs mx-auto">
                    <button
                      type="button"
                      onClick={() => {
                        if (circuitGates.G1 === activeQuestion.correctGates.G1) {
                          processCorrectAnswer();
                        } else {
                          logEvent(`❌ Salah! Aliran listrik sirkuit gagal menyalakan target sasaran. Angka saklar biner terpaksa diacak ulang demi keamanan.`);
                          processIncorrectAnswer();
                          setActiveQuestion(generateQuestion(2, questionsAnsweredInStage));
                          setCircuitGates({ G1: null, G2: null, G3: null });
                        }
                      }}
                      className="w-full bg-yellow-400 hover:bg-yellow-300 text-black py-3 px-4 border-4 border-black font-black uppercase tracking-wider shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-0.5 text-xs transition-all"
                    >
                      ⚡ PERIKSA JAWABAN SAKLAR
                    </button>
                  </div>

                </div>
              )}

              {/* 🟢 FORM TEXT LAMA: Aktif di Tahap 4, Tahap 1, dan Tahap 2 (Khusus Soal 1-5 saja karena bukan mode interaktif) */}
              {((currentStage === 2 && activeQuestion?.mode !== 'interactive-circuit') ||
                (currentStage === 1 && activeQuestion?.mode !== 'switch') ||
                currentStage === 4) && (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={playerAnswer}
                        onChange={(e) => setPlayerAnswer(e.target.value)}
                        placeholder={currentStage === 1 ? "MASUKKAN ANGKA HASIL KONVERSI KE DESIMAL..." : "Ketik rahasia kode pemecahan di tempat ini..."}
                        className="border-4 border-black p-3 grow font-bold focus:outline-none focus:bg-yellow-50 text-base uppercase shadow-inner placeholder:text-stone-400"
                        onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={checkAnswer}
                        className="bg-black text-white px-8 font-black uppercase tracking-wider border-4 border-black hover:bg-stone-800 active:translate-y-0.5 transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                      >
                        EKSEKUSI
                      </button>
                    </div>
                  </div>
                )}

              {/* 🟢 TAMPILAN BARU TAHAP 3: NEON SIGNAL STREAM (MAKEOVER VISUAL) */}
              {currentStage === 3 && activeQuestion && (
                <div className="my-6 p-6 bg-stone-950 border-4 border-black text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-size-[20px_20px] pointer-events-none" />

                  <div className="text-[10px] font-black text-emerald-400 tracking-widest uppercase mb-4 animate-pulse flex items-center justify-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    PENGANALISIS PERULANGAN LOGIKA AKTIF
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>

                  <div className="flex flex-wrap justify-center items-center gap-3 my-6">
                    {activeQuestion.question.match(/\d+,\s*\d+,\s*\d+,\s*\d+(,\s*\d+)?/)?.[0].split(',').map((numStr, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="bg-stone-900 border-2 border-emerald-500 text-emerald-400 font-mono text-xl md:text-2xl font-black w-14 h-14 md:w-16 md:h-16 flex flex-col justify-center items-center shadow-[0_0_10px_rgba(16,185,129,0.3)] relative group">
                          <span className="text-[8px] text-stone-500 font-bold absolute top-1 left-1">A_{idx + 1}</span>
                          <span className="drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]">{numStr.trim()}</span>
                        </div>
                        <span className="text-emerald-500 font-black text-xl">➔</span>
                      </div>
                    ))}

                    <div className="bg-stone-900 border-4 border-dashed border-amber-400 text-amber-400 font-mono text-xl md:text-2xl font-black w-14 h-14 md:w-16 md:h-16 flex flex-col justify-center items-center shadow-[0_0_12px_rgba(251,191,36,0.4)] animate-bounce relative">
                      <span className="text-[8px] text-amber-500 font-bold absolute top-1 left-1">TARGET</span>
                      <span className="drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]">
                        {playerAnswer ? playerAnswer : "?"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 max-w-md mx-auto space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={playerAnswer}
                        onChange={(e) => setPlayerAnswer(e.target.value)}
                        placeholder="MASUKKAN ANGKA SOLUSI..."
                        className="border-4 border-black p-3 bg-white grow font-black font-mono text-center focus:outline-none focus:bg-emerald-50 text-lg shadow-inner placeholder:text-stone-300 tracking-widest"
                        onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={checkAnswer}
                        className="bg-emerald-400 text-black px-6 font-black font-mono uppercase tracking-wider border-4 border-black hover:bg-emerald-300 active:translate-y-0.5 transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] text-xs md:text-sm"
                      >
                        ⚡ SUNTIKKAN KODE
                      </button>
                    </div>
                    <div className="text-[10px] font-bold text-stone-500 uppercase tracking-tight">
                      Tekan langsung tuts <kbd className="bg-stone-200 px-1 border border-black rounded shadow-sm">ENTER</kbd> atau tekan Suntikkan Kode untuk segera memverifikasi arus lalu lintas logika.
                    </div>
                  </div>
                </div>
              )}

              {/* 🟢 TAMPILAN BARU TAHAP 4: CYBER DECRYPTER CONSOLE */}
              {currentStage === 4 && activeQuestion && (
                <div className="my-4 p-5 bg-stone-900 border-4 border-black text-left shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative">
                  <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
                    MODUL DEKRIPSI // PORT_A47 AKTIF
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={playerAnswer}
                        onChange={(e) => setPlayerAnswer(e.target.value)}
                        placeholder={activeQuestion.question.includes('ANGKA KUNCI') ? "MASUKKAN ANGKA KUNCI..." : "MASUKKAN KODE teks jelas / SANDI..."}
                        className="border-4 border-black p-3 bg-stone-950 text-cyan-400 font-black font-mono text-lg grow focus:outline-none focus:ring-2 focus:ring-cyan-400 uppercase tracking-widest placeholder:text-stone-700"
                        onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={checkAnswer}
                        className="bg-cyan-400 text-black px-8 font-black font-mono uppercase tracking-wider border-4 border-black hover:bg-cyan-300 active:translate-y-0.5 transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] whitespace-nowrap text-xs md:text-sm"
                      >
                        🔓 PECAHKAN DATA
                      </button>
                    </div>
                    <div className="text-[9px] font-bold text-stone-500 uppercase tracking-tight">
                      Pakai selalu jenis huruf KAPITAL mutlak sewaktu hendak mengetik frasa gabungan dari pengenkripsian/pendekripsian laju paket data siber.
                    </div>
                  </div>
                </div>
              )}

              {/* HINT PETUNJUK FORMAT JAWABAN & TOMBOL DEVELOPER BYPASS */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4 border-t-2 border-stone-200">
                <div className="text-xs text-blue-600 font-bold uppercase tracking-tight max-w-xl">
                  {activeQuestion?.type === 'ARRAY-SORT' && "💡 Petunjuk Tata Cara Pengetikan: Letakkan kurung siku maupun pembatas koma tanpa menyelipkan bentuk ruang kosong (contoh pola: [3,5,1])"}
                  {activeQuestion?.type === 'BINARY-NODE' && activeQuestion?.question.includes('KODE BINER') && "💡 Petunjuk Tata Cara Pengetikan: Ketik langsung sasaran tanggapan dalam kombinasi 5 digit susunan angka biner komplit (contoh tebakan: 01101)"}
                  {activeQuestion?.type === 'BINARY-NODE' && activeQuestion?.question.includes('angka desimal') && "💡 Petunjuk Tata Cara Pengetikan: Tulis format ketikan balasanmu berbentuk angka desimal penomoran biasa (contoh isian: 19)"}
                  {currentStage === 5 && "💡 Tuntunan Pola Bermain: Langsung tunjuk serta klik bagian kotak menempel pada kolom maupun bidang baris yang menurut instingmu ketahuan menyimpan susunan jumlah digit angka bernilai 1 ganjil. Manakala salah sasaran perolehan klik, area letak tata letak hitungan biner akan seketika diatur acak mundur kembali!"}
                  {currentStage === 6 && "💡 Tuntunan Pola Bermain: Seret balok kuning ke titik putus-putus untuk memindahkannya."}
                </div>

                <div className="flex gap-2 w-full md:w-auto justify-end">
                  <button
                    type="button"
                    onClick={shuffleCurrentQuestion}
                    className="bg-stone-200 hover:bg-stone-300 text-stone-900 border-4 border-black text-xs px-3 py-2 font-black uppercase transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 whitespace-nowrap"
                  >
                    🔄 ACAK ULANG VARIASI
                  </button>

                  <button
                    type="button"
                    onClick={skipQuestion}
                    className="bg-red-600 hover:bg-red-700 text-white border-4 border-black text-xs px-3 py-2 font-black uppercase transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 whitespace-nowrap"
                  >
                    ⏩ PAKSA SOAL BERIKUTNYA
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* KOLOM KANAN: BROADCAST WIRE & PAPAN PANDUAN */}
          <div className="space-y-6">

            <div className="border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-lg font-black mb-2 uppercase tracking-tight">📠 PANEL INFORMASI</h2>
              <div className="space-y-1.5 text-xs bg-stone-950 text-emerald-400 p-3 rounded font-mono h-48 overflow-y-auto shadow-inner border-2 border-black">
                {gameLogs.map((log, idx) => (
                  <div key={idx} className="leading-relaxed">&gt; {log}</div>
                ))}
                <div ref={logEndRef} />
              </div>
            </div>

            {currentStage === 6 && activeQuestion && (
              <div className="border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-mono text-xs text-stone-900">
                <h3 className="text-xs font-black uppercase tracking-tight mb-2 text-stone-500">
                  📋 TARGET BENTUK STRUKTUR VISUAL (SOAL {activeQuestion.qNum})
                </h3>

                <p className="font-bold mb-3 text-stone-700 bg-stone-100 p-1.5 border border-black border-dashed leading-tight">
                  {activeQuestion.qNum === 1 && "💡 Target Sasaran: Rapikan blok letak keseluruhan data bertumpuk berurutan naik dari yang posisinya paling merendah hingga memuncak tajam setinggi-tingginya."}
                  {activeQuestion.qNum === 2 && "💡 Target Sasaran: Himpun gugus angka golongan Ganjil merapat tepat bagian kiri (menyusun naik meruncing ke atas), kemudian gabungkan angka golongan Genap tumpuk sisi samping kanan (sama urut posisinya semakin meningkat ke atas)."}
                  {activeQuestion.qNum === 3 && "💡 Target Sasaran: Tertibkan susunan tumpukan mengikuti urutan abjad pelafalan Huruf di letak depannya secara teliti lebih dulu (posisi perawalan A menukik tajam menuju batas C), setelah berhasil barulah berpatok menyesuaikan deret nomor angka letak sebelah belakangnya."}
                  {activeQuestion.qNum === 4 && "💡 Target Sasaran: Rakit sebuah pola bangunan susunan layaknya menara yang seimbang sisi kembar. Bergerak terus mendaki posisi lebih naik melintasi sayap kiri, dan menuruni perlahan turun merendah membelah garis batas luaran kanan, puncaknya bertemu titik perpotongan pusat dengan susunan ketinggian bernilai puncak tertinggi!"}
                  {activeQuestion.qNum === 5 && "💡 Target Sasaran: Amati fokus pada susunan deret digit nilai angka penempatan satuan (posisi ujung sisi paling ekor akhir baloknya). Jejerkan kumpulan blok kotak memuat angka ujung ekor [0-4] ke sayap kiri (mengurut naik perlahan), berikutnya tempatkan blok sisanya nilai [5-9] pada sudut sebelah sayap letak kanan luarnya (mengurut perlahan melaju ke posisi atas)."}
                </p>

                <div className="flex justify-center items-end gap-0.5 bg-stone-50 p-3 border-2 border-black min-h-27,5">

                  {activeQuestion.qNum === 1 && [10, 20, 30, 40, 50, 60, 70, 80, 90, 99].map((val) => (
                    <div key={val} style={{ height: `${20 + (val * 0.7)}px` }} className="flex-1 bg-emerald-200 border border-black flex flex-col justify-end pb-1 items-center font-black text-[8px] select-none">
                      {val}
                    </div>
                  ))}

                  {activeQuestion.qNum === 2 && [11, 33, 55, 77, 89, 93, 12, 24, 46, 68, 70, 82].map((val, i) => (
                    <div key={val} style={{ height: `${20 + (val * 0.7)}px` }} className={`flex-1 border border-black flex flex-col justify-between items-center py-1 font-black text-[7px] select-none ${i < 6 ? 'bg-purple-200' : 'bg-blue-200'}`}>
                      <span>{val}</span>
                      <span className="text-[5px] scale-75 opacity-40">{i === 2 ? 'GJ' : i === 8 ? 'GN' : ''}</span>
                    </div>
                  ))}

                  {activeQuestion.qNum === 3 && ['A2', 'A5', 'A9', 'B1', 'B4', 'B8', 'C3', 'C6', 'C7', 'C9'].map((val, i) => (
                    <div key={val} style={{ height: `${30 + (i * 6)}px` }} className="flex-1 bg-amber-200 border border-black flex flex-col justify-end pb-1 items-center font-black text-[8px] select-none">
                      {val}
                    </div>
                  ))}

                  {activeQuestion.qNum === 4 && [15, 30, 45, 65, 80, 98, 85, 70, 50, 35, 20].map((val, i) => (
                    <div key={i} style={{ height: `${20 + (val * 0.7)}px` }} className="flex-1 bg-teal-200 border border-black flex flex-col justify-end pb-1 items-center font-black text-[8px] select-none">
                      {val}
                    </div>
                  ))}

                  {activeQuestion.qNum === 5 && [10, 32, 44, 71, 83, 94, 25, 37, 56, 68, 79, 85].map((val, i) => {
                    const ekor = val % 10;
                    return (
                      <div key={i} style={{ height: `${20 + (val * 0.7)}px` }} className={`flex-1 border border-black flex flex-col justify-between items-center py-0.5 font-black text-[7px] select-none ${i < 6 ? 'bg-rose-200' : 'bg-orange-200'}`}>
                        <span>{val}</span>
                        <span className="text-[6px] font-normal scale-75 opacity-60">e:{ekor}</span>
                      </div>
                    );
                  })}

                </div>

                <div className="text-[9px] text-stone-400 font-bold text-center mt-2 uppercase tracking-tight">
                  ℹ️ Model simulasi contoh cetakan arsitektur tumpukan balok memakai pemetaan bentuk berskala pemodelan sekitar 10 sampai 12 contoh kepingan.
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* 🛠️ DEVELOPER TESTING OVERLAY */}
      <div className="mt-12 border-4 border-dashed border-red-500 bg-red-50 p-4 shadow-[4px_4px_0px_0px_rgba(239,68,68,1)]">
        <h3 className="text-sm font-black text-red-700 uppercase tracking-wider mb-2">
          ⚙️ Konsol Dev: Fitur Pengujian Sistem Pintas (Bypass Modul Tahapan Ujian)
        </h3>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6].map((stageNum) => (
            <button
              key={stageNum}
              type="button"
              onClick={() => {
                setCurrentStage(stageNum);
                setQuestionsAnsweredInStage(0);

                const devQ = generateQuestion(stageNum, 0);
                setActiveQuestion(devQ);
                setPlayerAnswer('');
                setFeedback({ type: 'success', msg: `Memicu pelompatan sistem sukses memasuki letak Tahap ${stageNum}.` });
                logEvent(`Konsol Dev: Mengalihkan fokus kendali saluran perpindahan sistem menunju lintasan Tahap ${stageNum}.`);

                if (stageNum === 6) {
                  setCurrentArrayData(devQ ? [...devQ.initialArray] : []);
                  setStudentMoves(0);
                }
              }}
              className={`px-3 py-1 text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] ${currentStage === stageNum ? 'bg-red-500 text-white' : 'bg-white text-black hover:bg-stone-100'
                }`}
            >
              Tahap {stageNum}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setIsExamComplete(true);
              setActiveQuestion(null);
              setFeedback({ type: 'success', msg: 'Sukses mempercepat loncatan menembus area pemunculan bingkai layar penghabisan modul sesi kalkulasi angka uji kemampuan!' });
            }}
            className="px-3 py-1 text-xs font-black uppercase bg-yellow-300 text-black border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-yellow-400"
          >
            🏁 Loncat Membuka Layar Lembar Hasil Penilaian Akhir
          </button>
        </div>
      </div>
    </div>
  );
}