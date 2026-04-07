<?php
/**
 * GET /dd/api/admin/me.php
 * Response: { ok: true, admin: true|false }
 */

require_once __DIR__ . '/../config.php';

require_method('GET');

json_response(['ok' => true, 'admin' => !empty($_SESSION['admin'])]);
