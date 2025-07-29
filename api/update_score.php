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
    if (!isset($input['nama']) || empty($input['nama'])) {
        throw new Exception('Nama pemain diperlukan');
    }
    
    if (!isset($input['poin']) || !is_numeric($input['poin'])) {
        throw new Exception('Poin harus berupa angka');
    }
    
    $nama = $input['nama'];
    $poin = (int)$input['poin'];
    
            // Cek apakah pemain sudah ada
        $stmt = $pdo->prepare("SELECT id, poin, waktu FROM karakter WHERE nama = ?");
        $stmt->execute([$nama]);
        
        if ($stmt->rowCount() > 0) {
            $currentData = $stmt->fetch();
            $currentPoin = (int)$currentData['poin'];
            
            // Update poin (ambil yang tertinggi antara poin lama dan baru)
            $newPoin = max($currentPoin, $poin);
            
            // Ambil waktu bermain dari input jika ada
            $waktuBermain = isset($input['waktu']) ? $input['waktu'] : '00:00:00';
            
            $sql = "UPDATE karakter SET poin = ?, waktu = ? WHERE nama = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$newPoin, $waktuBermain, $nama]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Skor berhasil diperbarui',
                'old_score' => $currentPoin,
                'new_score' => $newPoin,
                'waktu' => $waktuBermain,
                'action' => 'updated'
            ]);
        } else {
            // Jika pemain tidak ditemukan, buat entry baru
            $waktuBermain = isset($input['waktu']) ? $input['waktu'] : '00:00:00';
            $sql = "INSERT INTO karakter (nama, poin, waktu) VALUES (?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$nama, $poin, $waktuBermain]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Skor baru berhasil disimpan',
                'score' => $poin,
                'waktu' => $waktuBermain,
                'action' => 'inserted'
            ]);
        }
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'error' => $e->getMessage()
    ]);
}
?> 