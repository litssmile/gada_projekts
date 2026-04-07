<?php
/**
 * config.php — Central configuration
 * Route base: mvg.lv/dd/api/...
 */

// ─── Database ────────────────────────────────────────────────────────────────
define('DB_HOST', 'localhost');
define('DB_NAME', 'u547027111_mvg');
define('DB_USER', 'u547027111_mvg');       // change if needed
define('DB_PASS', 'MVGskola1');           // change if needed
define('DB_CHARSET', 'utf8mb4');

// ─── App ─────────────────────────────────────────────────────────────────────
define('SESSION_NAME', 'dd_session');
define('SESSION_LIFETIME', 60 * 60 * 8); // 8 hours

// ─── CORS — allow the React front-end origin ─────────────────────────────────
// In production replace '*' with your actual front-end URL, e.g. 'https://mvg.lv'
$allowed_origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed_origins = [
    'http://localhost:5173',   // Vite dev server
    'http://localhost:3000',
    'https://mvg.lv',
];

if (in_array($allowed_origin, $allowed_origins, true)) {
    header("Access-Control-Allow-Origin: $allowed_origin");
} else {
    header('Access-Control-Allow-Origin: https://mvg.lv');
}

header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');
header('Content-Type: application/json; charset=utf-8');

// Handle pre-flight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ─── Session ─────────────────────────────────────────────────────────────────
session_name(SESSION_NAME);
session_set_cookie_params([
    'lifetime' => SESSION_LIFETIME,
    'path'     => '/dd/',
    'domain'   => '',          // '' = current domain
    'secure'   => isset($_SERVER['HTTPS']),
    'httponly' => true,
    'samesite' => 'Lax',
]);
session_start();

// ─── Database connection (singleton) ─────────────────────────────────────────
function db(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = sprintf('mysql:host=%s;dbname=%s;charset=%s', DB_HOST, DB_NAME, DB_CHARSET);
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
    }
    return $pdo;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Send a JSON response and exit. */
function json_response(array $data, int $status = 200): never {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

/** Send an error JSON response and exit. */
function json_error(string $message, int $status = 400): never {
    json_response(['ok' => false, 'error' => $message], $status);
}

/** Require a specific HTTP method or abort with 405. */
function require_method(string $method): void {
    if ($_SERVER['REQUEST_METHOD'] !== strtoupper($method)) {
        json_error('Method not allowed', 405);
    }
}

/** Decode JSON request body or abort with 400. */
function json_body(): array {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        json_error('Invalid JSON body');
    }
    return $data;
}

/** Return the logged-in user_id or abort with 401. */
function require_auth(): int {
    if (empty($_SESSION['user_id'])) {
        json_error('Unauthorized', 401);
    }
    return (int) $_SESSION['user_id'];
}

/** Sanitise / trim a string field from an array. Returns null if not present or empty. */
function field(array $data, string $key): ?string {
    return isset($data[$key]) && trim((string)$data[$key]) !== ''
        ? trim((string)$data[$key])
        : null;
}
