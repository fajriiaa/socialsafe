<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    $nama = '';
    
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $nama = $_GET['nama'] ?? '';
    } else {
        $input = json_decode(file_get_contents('php://input'), true);
        $nama = $input['nama'] ?? '';
    }
    
    if (empty($nama)) {
        throw new Exception('Nama karakter diperlukan');
    }
    
    // Cek apakah nama sudah ada
    $stmt = $pdo->prepare("SELECT id FROM karakter WHERE nama = ?");
    $stmt->execute([$nama]);
    
    $exists = $stmt->rowCount() > 0;
    
    echo json_encode([
        'success' => true,
        'nama' => $nama,
        'available' => !$exists,
        'message' => $exists ? 'Nama sudah digunakan' : 'Nama tersedia'
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?> 