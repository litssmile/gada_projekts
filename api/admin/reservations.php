<?php
/**
 * GET /dd/api/admin/reservations.php
 *
 * Returns ALL reservations (all students), newest first.
 * Requires admin session.
 * Response: { ok: true, reservations: ApiReservation[] }
 */

require_once __DIR__ . '/../config.php';

require_method('GET');

if (empty($_SESSION['admin'])) {
    json_error('Unauthorized', 401);
}

$stmt = db()->query(
    'SELECT
        r.id,
        r.student_name  AS studentName,
        r.class_name    AS className,
        r.date,
        r.reason,
        r.notes,
        r.status,
        r.submitted_date AS submittedDate
     FROM dd_reservations r
     ORDER BY r.submitted_date DESC'
);
$rows = $stmt->fetchAll();

$reservations = array_map(function (array $r): array {
    return [
        'id'            => (int) $r['id'],
        'studentName'   => $r['studentName'],
        'className'     => $r['className'],
        'date'          => $r['date'],
        'reason'        => $r['reason'],
        'notes'         => $r['notes'] ?? '',
        'status'        => $r['status'],
        'submittedDate' => $r['submittedDate'],
    ];
}, $rows);

json_response(['ok' => true, 'reservations' => $reservations]);
