<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Invalid JSON input');
    }
    
    // Validasi data yang diperlukan
    $required_fields = ['nama', 'poin', 'position', 'waktu'];
    
    foreach ($required_fields as $field) {
        if (!isset($input[$field])) {
            throw new Exception("Field $field is required");
        }
    }
    
    // Tentukan status game berdasarkan posisi
    $status_game = ($input['position'] == 39) ? 'selesai' : 'progress';
    
    // Cek apakah karakter dengan nama tersebut sudah ada
    $stmt = $pdo->prepare("SELECT id FROM karakter WHERE nama = ?");
    $stmt->execute([$input['nama']]);
    
    if ($stmt->rowCount() > 0) {
        // Update data karakter yang sudah ada
        $sql = "UPDATE karakter SET 
                poin = ?, 
                position = ?, 
                waktu = ?,
                status_game = ?,
                hairColor = ?,
                hatColor = ?,
                shirtColor = ?,
                tieColor = ?,
                pantColor = ?,
                skinColor = ?,
                shoesColor = ?,
                hairStyle = ?,
                expression = ?
                WHERE nama = ?";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $input['poin'],
            $input['position'],
            $input['waktu'],
            $status_game,
            $input['hairColor'] ?? null,
            $input['hatColor'] ?? null,
            $input['shirtColor'] ?? null,
            $input['tieColor'] ?? null,
            $input['pantColor'] ?? null,
            $input['skinColor'] ?? null,
            $input['shoesColor'] ?? null,
            $input['hairStyle'] ?? null,
            $input['expression'] ?? null,
            $input['nama']
        ]);
        
        $message = ($status_game == 'selesai') ? 
            'Game selesai! Skor Anda telah masuk ke papan peringkat.' : 
            'Progress permainan berhasil disimpan';
            
        echo json_encode([
            'success' => true,
            'message' => $message,
            'action' => 'updated',
            'status_game' => $status_game
        ]);
    } else {
        // Insert data baru jika karakter belum ada
        $sql = "INSERT INTO karakter (nama, poin, position, waktu, status_game, hairColor, hatColor, shirtColor, tieColor, pantColor, skinColor, shoesColor, hairStyle, expression) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $input['nama'],
            $input['poin'],
            $input['position'],
            $input['waktu'],
            $status_game,
            $input['hairColor'] ?? null,
            $input['hatColor'] ?? null,
            $input['shirtColor'] ?? null,
            $input['tieColor'] ?? null,
            $input['pantColor'] ?? null,
            $input['skinColor'] ?? null,
            $input['shoesColor'] ?? null,
            $input['hairStyle'] ?? null,
            $input['expression'] ?? null
        ]);
        
        $message = ($status_game == 'selesai') ? 
            'Game selesai! Skor Anda telah masuk ke papan peringkat.' : 
            'Progress permainan berhasil disimpan';
            
        echo json_encode([
            'success' => true,
            'message' => $message,
            'action' => 'inserted',
            'id' => $pdo->lastInsertId(),
            'status_game' => $status_game
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'error' => $e->getMessage()
    ]);
}
?> 