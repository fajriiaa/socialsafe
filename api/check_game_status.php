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
    $nama = $_GET['nama'] ?? '';
    
    if (empty($nama)) {
        throw new Exception('Nama karakter diperlukan');
    }
    
    // Cek apakah karakter dengan nama tersebut sudah ada
    $sql = "SELECT id, nama, poin, position, waktu, status_game, hairColor, hatColor, shirtColor, tieColor, pantColor, skinColor, shoesColor, hairStyle, expression FROM karakter WHERE nama = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$nama]);
    
    if ($stmt->rowCount() > 0) {
        $character = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'exists' => true,
            'character' => $character,
            'can_continue' => $character['status_game'] === 'progress',
            'message' => $character['status_game'] === 'progress' ? 
                'Karakter ditemukan! Anda dapat melanjutkan permainan yang belum selesai.' : 
                'Karakter ditemukan! Permainan ini sudah selesai. Silakan buat karakter baru.'
        ]);
    } else {
        echo json_encode([
            'success' => true,
            'exists' => false,
            'message' => 'Nama karakter tersedia untuk digunakan.'
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'error' => $e->getMessage()
    ]);
}
?> 