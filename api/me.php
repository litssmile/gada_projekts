<?php
/**
 * GET /dd/api/me.php
 *
 * Returns the currently logged-in user, or null if no session.
 * Response: { ok: true, user: { id, ssn, name } | null }
 */

require_once __DIR__ . '/config.php';

require_method('GET');

if (empty($_SESSION['user_id'])) {
    json_response(['ok' => true, 'user' => null]);
}

$stmt = db()->prepare('SELECT id, ssn, name FROM dd_users WHERE id = :id');
$stmt->execute([':id' => (int) $_SESSION['user_id']]);
$user = $stmt->fetch();

if (!$user) {
    // Session points to a deleted user — clear it
    session_destroy();
    json_response(['ok' => true, 'user' => null]);
}

json_response([
    'ok'   => true,
    'user' => [
        'id'   => (int) $user['id'],
        'ssn'  => $user['ssn'],
        'name' => $user['name'],
    ],
]);
