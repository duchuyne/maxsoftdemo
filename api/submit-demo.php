<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

function respond(int $status, bool $success, string $message): never
{
    http_response_code($status);
    echo json_encode(
        ['success' => $success, 'message' => $message],
        JSON_UNESCAPED_UNICODE
    );
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, false, 'Phương thức không được hỗ trợ.');
}

$configPath = __DIR__ . '/config.php';
if (!is_file($configPath)) {
    respond(503, false, 'API chưa được cấu hình database trên hosting.');
}

$config = require $configPath;
$payload = json_decode(file_get_contents('php://input') ?: '', true);
if (!is_array($payload)) {
    respond(400, false, 'Dữ liệu gửi lên không hợp lệ.');
}

$name = trim((string)($payload['name'] ?? ''));
$phone = trim((string)($payload['phone'] ?? ''));
$company = trim((string)($payload['company'] ?? ''));
$package = trim((string)($payload['package'] ?? ''));

if ($name === '' || $phone === '' || $company === '') {
    respond(422, false, 'Vui lòng nhập đầy đủ họ tên, số điện thoại và công ty.');
}
if (mb_strlen($name) > 120 || mb_strlen($phone) > 30 || mb_strlen($company) > 200 || mb_strlen($package) > 120) {
    respond(422, false, 'Thông tin đăng ký vượt quá độ dài cho phép.');
}

$db = $config['db'] ?? [];
$dsn = sprintf(
    'mysql:host=%s;port=%d;dbname=%s;charset=%s',
    $db['host'] ?? '',
    (int)($db['port'] ?? 3306),
    $db['name'] ?? '',
    $db['charset'] ?? 'utf8mb4'
);

try {
    $pdo = new PDO($dsn, (string)($db['user'] ?? ''), (string)($db['password'] ?? ''), [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    $statement = $pdo->prepare(
        'INSERT INTO demo_registrations (name, phone, company, package_name, ip_address, user_agent)
         VALUES (:name, :phone, :company, :package_name, :ip_address, :user_agent)'
    );
    $statement->execute([
        ':name' => $name,
        ':phone' => $phone,
        ':company' => $company,
        ':package_name' => $package,
        ':ip_address' => substr((string)($_SERVER['REMOTE_ADDR'] ?? ''), 0, 45),
        ':user_agent' => substr((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 500),
    ]);
} catch (Throwable $error) {
    error_log('MaxSoft demo registration failed: ' . $error->getMessage());
    respond(500, false, 'Không thể lưu đăng ký lúc này. Vui lòng gọi hotline 0123456789.');
}

respond(201, true, 'Đăng ký thành công.');
