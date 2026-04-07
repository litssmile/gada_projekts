<?php
/**
 * POST /dd/api/reservations/create.php
 *
 * Body: {
 *   studentName: string,
 *   className:   string,
 *   date:        string,   // ISO 8601 (e.g. "2025-06-15T00:00:00.000Z")
 *   reason:      string,
 *   notes?:      string
 * }
 *
 * Response: { ok: true, reservation: ApiReservation }
 */

require_once __DIR__ . '/../config.php';

require_method('POST');

$userId = require_auth();
$body   = json_body();

// ─── Extract & validate fields ───────────────────────────────────────────────
$studentName = field($body, 'studentName');
$className   = field($body, 'className');
$dateRaw     = field($body, 'date');
$reason      = field($body, 'reason');
$notes       = isset($body['notes']) ? trim((string)$body['notes']) : '';

if (!$studentName) json_error('Skolēna vārds ir obligāts');
if (!$className)   json_error('Klase ir obligāta');
if (!$dateRaw)     json_error('Datums ir obligāts');
if (!$reason)      json_error('Iemesls ir obligāts');

// Normalise date — accept ISO 8601 or YYYY-MM-DD
$ts = strtotime($dateRaw);
if ($ts === false) {
    json_error('Nederīgs datuma formāts');
}
$date = date('Y-m-d', $ts);

// Date must not be in the past
if ($date < date('Y-m-d')) {
    json_error('Datumam jābūt nākotnē');
}

// Allowed reason values (mirrors front-end Select options)
$allowedReasons = [
    'Garīgā veselība un labbūtība',
    'Stresa pārvaldība',
    'Personīgā labbūtība',
    'Pašaprūpes diena',
    'Cits',
];
if (!in_array($reason, $allowedReasons, true)) {
    json_error('Nederīgs iemesls');
}

// Allowed class values
$allowedClasses = [
    '9.A klase','9.B klase',
    '10.A klase','10.B klase',
    '11.A klase','11.B klase',
    '12.A klase','12.B klase',
];
if (!in_array($className, $allowedClasses, true)) {
    json_error('Nederīga klase');
}

// ─── Insert ──────────────────────────────────────────────────────────────────
$pdo = db();
$ins = $pdo->prepare(
    'INSERT INTO dd_reservations
        (user_id, student_name, class_name, date, reason, notes)
     VALUES
        (:uid, :sn, :cn, :dt, :rs, :nt)'
);
$ins->execute([
    ':uid' => $userId,
    ':sn'  => $studentName,
    ':cn'  => $className,
    ':dt'  => $date,
    ':rs'  => $reason,
    ':nt'  => $notes,
]);
$newId = (int) $pdo->lastInsertId();

// Fetch back to get server-generated timestamps
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
$sel->execute([':id' => $newId]);
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
], 201);
