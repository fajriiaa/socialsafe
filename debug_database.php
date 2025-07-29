<?php
// Debug database connection dan struktur
require_once 'config/database.php';

echo "<h2>🔍 Debug Database Connection</h2>";

try {
    // Test koneksi dasar
    echo "<p>✅ Koneksi database berhasil!</p>";
    
    // Cek tabel yang ada
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll();
    
    echo "<h3>📋 Tabel yang tersedia:</h3>";
    echo "<ul>";
    foreach ($tables as $table) {
        echo "<li>" . $table[0] . "</li>";
    }
    echo "</ul>";
    
    // Cek struktur tabel karakter jika ada
    $stmt = $pdo->query("SHOW TABLES LIKE 'karakter'");
    if ($stmt->rowCount() > 0) {
        echo "<h3>📊 Struktur tabel 'karakter':</h3>";
        $stmt = $pdo->query("DESCRIBE karakter");
        $columns = $stmt->fetchAll();
        
        echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
        echo "<tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th></tr>";
        foreach ($columns as $column) {
            echo "<tr>";
            echo "<td>" . $column['Field'] . "</td>";
            echo "<td>" . $column['Type'] . "</td>";
            echo "<td>" . $column['Null'] . "</td>";
            echo "<td>" . $column['Key'] . "</td>";
            echo "<td>" . $column['Default'] . "</td>";
            echo "</tr>";
        }
        echo "</table>";
        
        // Cek data dalam tabel
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM karakter");
        $result = $stmt->fetch();
        echo "<p><strong>Total data dalam tabel karakter: " . $result['total'] . "</strong></p>";
        
        if ($result['total'] > 0) {
            echo "<h3>📋 Sample data (5 terakhir):</h3>";
            $stmt = $pdo->query("SELECT * FROM karakter ORDER BY id DESC LIMIT 5");
            $data = $stmt->fetchAll();
            
            echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
            if (!empty($data)) {
                echo "<tr>";
                foreach (array_keys($data[0]) as $header) {
                    echo "<th>" . $header . "</th>";
                }
                echo "</tr>";
                
                foreach ($data as $row) {
                    echo "<tr>";
                    foreach ($row as $value) {
                        echo "<td>" . ($value ?? 'NULL') . "</td>";
                    }
                    echo "</tr>";
                }
            }
            echo "</table>";
        }
        
    } else {
        echo "<p>❌ Tabel 'karakter' tidak ditemukan!</p>";
        echo "<p>Membuat tabel karakter...</p>";
        
        $sql = "CREATE TABLE karakter (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nama VARCHAR(255) NOT NULL,
            poin INT DEFAULT 0,
            position INT DEFAULT 0,
            waktu TIME DEFAULT '00:00:00',
            status_game ENUM('progress', 'selesai') DEFAULT 'progress',
            hairColor VARCHAR(50),
            hatColor VARCHAR(50),
            shirtColor VARCHAR(50),
            tieColor VARCHAR(50),
            pantColor VARCHAR(50),
            skinColor VARCHAR(50),
            shoesColor VARCHAR(50),
            hairStyle VARCHAR(50),
            expression VARCHAR(50),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )";
        
        $pdo->exec($sql);
        echo "<p>✅ Tabel 'karakter' berhasil dibuat!</p>";
    }
    
    // Test query leaderboard
    echo "<h3>🧪 Test Query Leaderboard:</h3>";
    try {
        $sql = "SELECT nama, poin, waktu FROM karakter WHERE poin >= 0 AND status_game = 'selesai' ORDER BY poin DESC, waktu ASC LIMIT 10";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $leaderboard = $stmt->fetchAll();
        
        echo "<p>Query: " . $sql . "</p>";
        echo "<p>Hasil: " . count($leaderboard) . " records</p>";
        
        if (!empty($leaderboard)) {
            echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
            echo "<tr><th>Nama</th><th>Poin</th><th>Waktu</th></tr>";
            foreach ($leaderboard as $row) {
                echo "<tr>";
                echo "<td>" . $row['nama'] . "</td>";
                echo "<td>" . $row['poin'] . "</td>";
                echo "<td>" . $row['waktu'] . "</td>";
                echo "</tr>";
            }
            echo "</table>";
        } else {
            echo "<p>⚠️ Tidak ada data yang memenuhi kriteria leaderboard</p>";
        }
        
    } catch (Exception $e) {
        echo "<p>❌ Error pada test query: " . $e->getMessage() . "</p>";
    }
    
} catch (PDOException $e) {
    echo "<p>❌ Error koneksi database: " . $e->getMessage() . "</p>";
    echo "<p>Kode error: " . $e->getCode() . "</p>";
}
?> 