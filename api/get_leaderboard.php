<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    // Cek apakah tabel karakter ada
    $stmt = $pdo->query("SHOW TABLES LIKE 'karakter'");
    if ($stmt->rowCount() == 0) {
        // Jika tabel tidak ada, buat tabel
        $createTableSQL = "CREATE TABLE karakter (
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
        $pdo->exec($createTableSQL);
    }
    
    // Cek apakah ada data dalam tabel
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM karakter");
    $totalData = $stmt->fetch();
    
    if ($totalData['total'] == 0) {
        // Jika tidak ada data, kembalikan array kosong
        echo json_encode([
            'success' => true,
            'leaderboard' => [],
            'total_players' => 0,
            'message' => 'Belum ada data pemain'
        ]);
        exit;
    }
    
    // Ambil data papan peringkat, hanya game yang sudah selesai, urutkan berdasarkan poin tertinggi
    $sql = "SELECT nama, poin, waktu FROM karakter WHERE poin >= 0 AND status_game = 'selesai' ORDER BY poin DESC, waktu ASC LIMIT 10";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    
    $leaderboard = $stmt->fetchAll();
    
    // Jika tidak ada data yang selesai, ambil semua data untuk testing
    if (empty($leaderboard)) {
        $sql = "SELECT nama, poin, waktu FROM karakter WHERE poin >= 0 ORDER BY poin DESC, waktu ASC LIMIT 10";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $leaderboard = $stmt->fetchAll();
    }
    
    // Format waktu untuk tampilan (waktu bermain dalam format HH:MM:SS)
    foreach ($leaderboard as $index => &$player) {
        // Tambahkan peringkat asli (index + 1)
        $player['peringkat_asli'] = $index + 1;
        
        if ($player['waktu'] && $player['waktu'] !== '00:00:00') {
            // Jika waktu dalam format HH:MM:SS, tampilkan langsung
            if (preg_match('/^\d{2}:\d{2}:\d{2}$/', $player['waktu'])) {
                $player['waktu_formatted'] = $player['waktu'];
            } else {
                // Jika format lain, coba parse
                $player['waktu_formatted'] = $player['waktu'];
            }
        } else {
            $player['waktu_formatted'] = '00:00:00';
        }
    }
    
    echo json_encode([
        'success' => true,
        'leaderboard' => $leaderboard,
        'total_players' => count($leaderboard)
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Database error: ' . $e->getMessage(),
        'success' => false
    ]);
}
?> 