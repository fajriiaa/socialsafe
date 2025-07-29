<?php
// Tambah data test untuk leaderboard
require_once 'config/database.php';

try {
    echo "<h2>🧪 Menambahkan Data Test</h2>";
    
    // Cek apakah tabel karakter ada
    $stmt = $pdo->query("SHOW TABLES LIKE 'karakter'");
    if ($stmt->rowCount() == 0) {
        echo "<p>❌ Tabel karakter tidak ditemukan!</p>";
        exit;
    }
    
    // Data test untuk leaderboard
    $testData = [
        ['nama' => 'Player1', 'poin' => 1500, 'waktu' => '00:05:30', 'status_game' => 'selesai'],
        ['nama' => 'Player2', 'poin' => 1200, 'waktu' => '00:04:45', 'status_game' => 'selesai'],
        ['nama' => 'Player3', 'poin' => 1800, 'waktu' => '00:06:20', 'status_game' => 'selesai'],
        ['nama' => 'Player4', 'poin' => 900, 'waktu' => '00:03:15', 'status_game' => 'selesai'],
        ['nama' => 'Player5', 'poin' => 2100, 'waktu' => '00:07:45', 'status_game' => 'selesai'],
        ['nama' => 'TestUser', 'poin' => 800, 'waktu' => '00:02:30', 'status_game' => 'selesai'],
        ['nama' => 'DemoPlayer', 'poin' => 1600, 'waktu' => '00:05:10', 'status_game' => 'selesai'],
        ['nama' => 'GameMaster', 'poin' => 2500, 'waktu' => '00:08:20', 'status_game' => 'selesai'],
        ['nama' => 'Newbie', 'poin' => 600, 'waktu' => '00:02:00', 'status_game' => 'selesai'],
        ['nama' => 'ProPlayer', 'poin' => 1900, 'waktu' => '00:06:45', 'status_game' => 'selesai']
    ];
    
    $inserted = 0;
    foreach ($testData as $data) {
        // Cek apakah nama sudah ada
        $stmt = $pdo->prepare("SELECT id FROM karakter WHERE nama = ?");
        $stmt->execute([$data['nama']]);
        
        if ($stmt->rowCount() == 0) {
            // Insert data baru
            $sql = "INSERT INTO karakter (nama, poin, waktu, status_game) VALUES (?, ?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$data['nama'], $data['poin'], $data['waktu'], $data['status_game']]);
            $inserted++;
            echo "<p>✅ Ditambahkan: {$data['nama']} - {$data['poin']} poin</p>";
        } else {
            echo "<p>⚠️ {$data['nama']} sudah ada, dilewati</p>";
        }
    }
    
    echo "<h3>📊 Hasil:</h3>";
    echo "<p>Total data yang ditambahkan: $inserted</p>";
    
    // Tampilkan leaderboard setelah penambahan
    echo "<h3>🏆 Leaderboard Saat Ini:</h3>";
    $sql = "SELECT nama, poin, waktu FROM karakter WHERE status_game = 'selesai' ORDER BY poin DESC, waktu ASC LIMIT 10";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $leaderboard = $stmt->fetchAll();
    
    if (!empty($leaderboard)) {
        echo "<table border='1' style='border-collapse: collapse; width: 100%; margin-top: 10px;'>";
        echo "<tr><th>Rank</th><th>Nama</th><th>Poin</th><th>Waktu</th></tr>";
        foreach ($leaderboard as $index => $player) {
            $rank = $index + 1;
            $medal = '';
            if ($rank == 1) $medal = '🥇 ';
            elseif ($rank == 2) $medal = '🥈 ';
            elseif ($rank == 3) $medal = '🥉 ';
            
            echo "<tr>";
            echo "<td>{$medal}{$rank}</td>";
            echo "<td>{$player['nama']}</td>";
            echo "<td>{$player['poin']}</td>";
            echo "<td>{$player['waktu']}</td>";
            echo "</tr>";
        }
        echo "</table>";
    } else {
        echo "<p>❌ Tidak ada data leaderboard</p>";
    }
    
    echo "<p><a href='index.html'>← Kembali ke Halaman Utama</a></p>";
    
} catch (PDOException $e) {
    echo "<p>❌ Error: " . $e->getMessage() . "</p>";
}
?> 