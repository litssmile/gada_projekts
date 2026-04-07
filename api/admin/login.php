<?php
/**
 * POST /dd/api/admin/login.php
 */

require_once __DIR__ . '/../config.php';

require_method('POST');

$body     = json_body();
$username = field($body, 'username');
$password = field($body, 'password');

if (!$username || !$password) {
    json_error('Lietotājvārds un parole ir obligāti');
}

// Simple hardcoded check — change these values directly here
$adminUsername = 'admin';
$adminPassword = 'admin123';

if ($username !== $adminUsername || $password !== $adminPassword) {
    json_error('Nepareizs lietotājvārds vai parole', 401);
}

session_regenerate_id(true);
$_SESSION['admin']      = true;
$_SESSION['admin_user'] = $username;

json_response(['ok' => true]);