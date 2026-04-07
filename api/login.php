<?php
/**
 * POST /dd/api/login.php
 *
 * Body: { "ssn": "XXXXXX-XXXXX", "name": "Vārds Uzvārds" }
 *
 * Creates the user row if they don't exist yet (first-time login),
 * then starts an authenticated session.
 *
 * Response: { ok: true, user: { id, ssn, name } }
 */

require_once __DIR__ . '/config.php';

require_method('POST');

$body = json_body();

$ssn  = field($body, 'ssn');
$name = field($body, 'name');

// ─── Validation ──────────────────────────────────────────────────────────────
if (!$ssn) {
    json_error('Personas kods ir obligāts');
}
if (!$name) {
    json_error('Vārds ir obligāts');
}

// Validate SSN format: exactly 11 digits (with optional dash after position 6)
$ssnDigits = preg_replace('/\D/', '', $ssn);
if (strlen($ssnDigits) !== 11) {
    json_error('Personas kodam jābūt 11 cipariem');
}

// Normalise to XXXXXX-XXXXX
$ssnNorm = substr($ssnDigits, 0, 6) . '-' . substr($ssnDigits, 6);

// ─── Upsert user ─────────────────────────────────────────────────────────────
$pdo = db();

// Try to find an existing user by SSN
$stmt = $pdo->prepare('SELECT id, ssn, name FROM dd_users WHERE ssn = :ssn');
$stmt->execute([':ssn' => $ssnNorm]);
$user = $stmt->fetch();

if (!$user) {
    // First visit — create the user
    $ins = $pdo->prepare('INSERT INTO dd_users (ssn, name) VALUES (:ssn, :name)');
    $ins->execute([':ssn' => $ssnNorm, ':name' => $name]);
    $user = [
        'id'   => (int) $pdo->lastInsertId(),
        'ssn'  => $ssnNorm,
        'name' => $name,
    ];
} else {
    // Returning user — update their name in case it changed
    $upd = $pdo->prepare('UPDATE dd_users SET name = :name WHERE id = :id');
    $upd->execute([':name' => $name, ':id' => $user['id']]);
    $user['name'] = $name;
}

// ─── Start session ───────────────────────────────────────────────────────────
session_regenerate_id(true);
$_SESSION['user_id'] = $user['id'];

json_response([
    'ok'   => true,
    'user' => [
        'id'   => (int) $user['id'],
        'ssn'  => $user['ssn'],
        'name' => $user['name'],
    ],
]);
