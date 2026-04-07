<?php
/**
 * POST /dd/api/logout.php
 *
 * Destroys the current session.
 * Response: { ok: true }
 */

require_once __DIR__ . '/config.php';

require_method('POST');

// Destroy session regardless of whether user is logged in
$_SESSION = [];
if (ini_get('session.use_cookies')) {
    $p = session_get_cookie_params();
    setcookie(
        session_name(), '', time() - 42000,
        $p['path'], $p['domain'], $p['secure'], $p['httponly']
    );
}
session_destroy();

json_response(['ok' => true]);
