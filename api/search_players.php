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
    // Ambil semua data player untuk search (tanpa limit)
    $sql = "SELECT nama, poin, waktu FROM karakter WHERE poin >= 0 AND status_game = 'selesai' ORDER BY poin DESC, waktu ASC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    
    $allPlayers = $stmt->fetchAll();
    
    // Debug: tampilkan query dan jumlah hasil
    error_log("Search players query: " . $sql);
    error_log("Search players results count: " . count($allPlayers));
    
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
        'error' => $e->getMessage()
    ]);
}
?> 