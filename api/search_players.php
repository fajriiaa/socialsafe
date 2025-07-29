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
        echo json_encode([
            'success' => true,
            'players' => [],
            'total_players' => 0,
            'message' => 'Tabel karakter belum ada'
        ]);
        exit;
    }
    
    // Cek apakah ada data dalam tabel
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM karakter");
    $totalData = $stmt->fetch();
    
    if ($totalData['total'] == 0) {
        echo json_encode([
            'success' => true,
            'players' => [],
            'total_players' => 0,
            'message' => 'Belum ada data pemain'
        ]);
        exit;
    }
    
    // Ambil semua data player untuk search (tanpa limit)
    $sql = "SELECT nama, poin, waktu FROM karakter WHERE poin >= 0 AND status_game = 'selesai' ORDER BY poin DESC, waktu ASC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    
    $allPlayers = $stmt->fetchAll();
    
    // Jika tidak ada data yang selesai, ambil semua data untuk testing
    if (empty($allPlayers)) {
        $sql = "SELECT nama, poin, waktu FROM karakter WHERE poin >= 0 ORDER BY poin DESC, waktu ASC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $allPlayers = $stmt->fetchAll();
    }
    
    // Format waktu untuk tampilan dan tambahkan peringkat asli
    foreach ($allPlayers as $index => &$player) {
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
        'players' => $allPlayers,
        'total_players' => count($allPlayers)
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Database error: ' . $e->getMessage(),
        'success' => false
    ]);
}
?> 