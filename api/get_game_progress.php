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
    // Ambil nama pemain dari parameter URL
    $nama = $_GET['nama'] ?? null;
    
    if (!$nama) {
        throw new Exception('Parameter nama diperlukan');
    }
    
    // Cari data karakter berdasarkan nama
    $stmt = $pdo->prepare("SELECT * FROM karakter WHERE nama = ? AND status_game = 'progress' ORDER BY id DESC LIMIT 1");
    $stmt->execute([$nama]);
    
    if ($stmt->rowCount() > 0) {
        $karakter = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Pastikan position dan poin adalah integer yang valid
        $position = (int)$karakter['position'];
        $poin = (int)$karakter['poin'];
        
        // Jika position adalah 0 dan status_game bukan 'progress', kemungkinan ini user baru
        if ($position == 0 && $karakter['status_game'] != 'progress') {
            echo json_encode([
                'success' => true,
                'data' => null,
                'message' => 'User baru, tidak ada progress tersimpan'
            ]);
        } else {
            echo json_encode([
                'success' => true,
                'data' => [
                    'nama' => $karakter['nama'],
                    'poin' => $poin,
                    'position' => $position,
                    'waktu' => $karakter['waktu'],
                    'status_game' => $karakter['status_game'],
                    'hairColor' => $karakter['hairColor'],
                    'hatColor' => $karakter['hatColor'],
                    'shirtColor' => $karakter['shirtColor'],
                    'tieColor' => $karakter['tieColor'],
                    'pantColor' => $karakter['pantColor'],
                    'skinColor' => $karakter['skinColor'],
                    'shoesColor' => $karakter['shoesColor'],
                    'hairStyle' => $karakter['hairStyle'],
                    'expression' => $karakter['expression']
                ]
            ]);
        }
    } else {
        // Jika tidak ada progress yang tersimpan, kembalikan data default
        echo json_encode([
            'success' => true,
            'data' => null,
            'message' => 'Tidak ada progress tersimpan untuk pemain ini'
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'error' => $e->getMessage()
    ]);
}
?> 