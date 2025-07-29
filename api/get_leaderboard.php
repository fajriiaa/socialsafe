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
    // Ambil data papan peringkat, hanya game yang sudah selesai, urutkan berdasarkan poin tertinggi
    $sql = "SELECT nama, poin, waktu FROM karakter WHERE poin >= 0 AND status_game = 'selesai' ORDER BY poin DESC, waktu ASC LIMIT 10";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    
    $leaderboard = $stmt->fetchAll();
    
    // Debug: tampilkan query dan jumlah hasil
    error_log("Leaderboard query: " . $sql);
    error_log("Leaderboard results count: " . count($leaderboard));
    
    // Debug: tampilkan semua data untuk troubleshooting
    $debug_sql = "SELECT id, nama, poin, position, status_game, waktu FROM karakter ORDER BY id DESC LIMIT 5";
    $debug_stmt = $pdo->prepare($debug_sql);
    $debug_stmt->execute();
    $debug_data = $debug_stmt->fetchAll();
    error_log("Debug data: " . json_encode($debug_data));
    
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
        'error' => $e->getMessage()
    ]);
}
?> 