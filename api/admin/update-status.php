<?php
/**
 * POST /dd/api/admin/update-status.php
 *
 * Body: { "id": 7, "status": "approved" | "denied" }
 * Requires admin session.
 * Response: { ok: true, reservation: ApiReservation }
 */

require_once __DIR__ . '/../config.php';

require_method('POST');

if (empty($_SESSION['admin'])) {
    json_error('Unauthorized', 401);
}

$body   = json_body();
$id     = isset($body['id']) ? (int) $body['id'] : 0;
$status = field($body, 'status');

if ($id <= 0) {
    json_error('Nederīgs pieprasījuma ID');
}
if (!in_array($status, ['approved', 'denied'], true)) {
    json_error('Statusam jābūt "approved" vai "denied"');
}

$pdo = db();

// Check reservation exists
$chk = $pdo->prepare('SELECT id FROM dd_reservations WHERE id = :id');
$chk->execute([':id' => $id]);
if (!$chk->fetch()) {
    json_error('Pieprasījums nav atrasts', 404);
}

// Update
$upd = $pdo->prepare('UPDATE dd_reservations SET status = :status WHERE id = :id');
$upd->execute([':status' => $status, ':id' => $id]);

// Return updated record
$sel = $pdo->prepare(
    'SELECT
        id,
        student_name  AS studentName,
        class_name    AS className,
        date,
        reason,
        notes,
        status,
        submitted_date AS submittedDate
     FROM dd_reservations WHERE id = :id'
);
$sel->execute([':id' => $id]);
$row = $sel->fetch();

json_response([
    'ok' => true,
    'reservation' => [
        'id'            => (int) $row['id'],
        'studentName'   => $row['studentName'],
        'className'     => $row['className'],
        'date'          => $row['date'],
        'reason'        => $row['reason'],
        'notes'         => $row['notes'] ?? '',
        'status'        => $row['status'],
        'submittedDate' => $row['submittedDate'],
    ],
]);
