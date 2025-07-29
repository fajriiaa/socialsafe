<?php
// Konfigurasi Database
$host = 'https://sql308.infinityfree.com';
$dbname = 'if0_39583769_socisafe';
$username = 'if0_39583769';
$password = 'Zh4SJN8HHjEPFN';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    die("Koneksi database gagal: " . $e->getMessage());
}
?> 