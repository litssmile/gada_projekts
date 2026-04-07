<?php
/**
 * GET /dd/api/reservations/list.php
 *
 * Returns all reservations for the authenticated user, newest first.
 * Response: { ok: true, reservations: ApiReservation[] }
 */

require_once __DIR__ . '/../config.php';

require_method('GET');

$userId = require_auth();

$stmt = db()->prepare(
    'SELECT
        id,
        student_name  AS studentName,
        class_name    AS className,
        date,
        reason,
        notes,
        status,
        submitted_date AS submittedDate
     FROM dd_reservations
     WHERE user_id = :uid
     ORDER BY submitted_date DESC'
);
$stmt->execute([':uid' => $userId]);
$rows = $stmt->fetchAll();

// Cast types for JSON output
$reservations = array_map(function (array $r): array {
    return [
        'id'            => (int) $r['id'],
        'studentName'   => $r['studentName'],
        'className'     => $r['className'],
        'date'          => $r['date'],          // YYYY-MM-DD
        'reason'        => $r['reason'],
        'notes'         => $r['notes'] ?? '',
        'status'        => $r['status'],
        'submittedDate' => $r['submittedDate'], // YYYY-MM-DD HH:MM:SS
    ];
}, $rows);

json_response(['ok' => true, 'reservations' => $reservations]);
