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
    $required_fields = ['nama', 'hairColor', 'hatColor', 'shirtColor', 'tieColor', 'pantColor', 'skinColor', 'shoesColor', 'hairStyle', 'expression'];
    
    foreach ($required_fields as $field) {
        if (!isset($input[$field]) || empty($input[$field])) {
            throw new Exception("Field $field is required");
        }
    }
    
            // Cek apakah nama sudah ada
        $stmt = $pdo->prepare("SELECT id FROM karakter WHERE nama = ?");
        $stmt->execute([$input['nama']]);
        
        if ($stmt->rowCount() > 0) {
            // Nama sudah ada, kembalikan error
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Nama karakter sudah digunakan. Silakan pilih nama lain.',
                'action' => 'name_exists'
            ]);
            exit;
        } else {
            // Insert data baru
            $sql = "INSERT INTO karakter (nama, hairColor, hatColor, shirtColor, tieColor, pantColor, skinColor, shoesColor, hairStyle, expression, poin, waktu) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, '00:00:00')";
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $input['nama'],
                $input['hairColor'],
                $input['hatColor'],
                $input['shirtColor'],
                $input['tieColor'],
                $input['pantColor'],
                $input['skinColor'],
                $input['shoesColor'],
                $input['hairStyle'],
                $input['expression']
            ]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Karakter berhasil disimpan',
                'action' => 'inserted',
                'id' => $pdo->lastInsertId()
            ]);
        }
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'error' => $e->getMessage()
    ]);
}
?> 