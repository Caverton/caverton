<?php
header('Content-Type: application/json; charset=utf-8');

$prenom  = htmlspecialchars(trim($_POST['prenom']  ?? ''));
$nom     = htmlspecialchars(trim($_POST['nom']     ?? ''));
$tel     = htmlspecialchars(trim($_POST['telephone'] ?? ''));
$email   = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$message = htmlspecialchars(trim($_POST['message'] ?? ''));

if (!$prenom || !$nom || !$email || !$message) {
    echo json_encode(['status' => 'error', 'message' => 'Champs manquants.']);
    exit;
}

$destinataire = 'contact@jassureassurances.com';
$sujet        = "=?UTF-8?B?" . base64_encode("Nouveau message – $prenom $nom") . "?=";
$boundary     = md5(uniqid(time()));

// ── Corps du mail ──────────────────────────────────────────
$corps = "Prénom  : $prenom\r\n"
       . "Nom     : $nom\r\n"
       . "Tél     : $tel\r\n"
       . "Email   : $email\r\n\r\n"
       . "Message :\r\n$message";

// ── Vérification pièce jointe ──────────────────────────────
$hasFile = isset($_FILES['fichier'])
        && $_FILES['fichier']['error'] === 0
        && $_FILES['fichier']['size']  > 0;

// Limite à 5 Mo
if ($hasFile && $_FILES['fichier']['size'] > 5 * 1024 * 1024) {
    echo json_encode(['status' => 'error', 'message' => 'Pièce jointe trop lourde (5 Mo maximum).']);
    exit;
}

// Types autorisés
$typesAutorises = ['application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg', 'image/png'];

if ($hasFile && !in_array($_FILES['fichier']['type'], $typesAutorises)) {
    echo json_encode(['status' => 'error', 'message' => 'Type de fichier non autorisé.']);
    exit;
}

// ── Construction du mail ───────────────────────────────────
if ($hasFile) {
    // Mail multipart avec pièce jointe
    $filename    = basename($_FILES['fichier']['name']);
    $fileContent = chunk_split(base64_encode(file_get_contents($_FILES['fichier']['tmp_name'])));
    $fileType    = $_FILES['fichier']['type'];

    $headers  = "From: contact@jassureassurances.com\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";

    $body  = "--$boundary\r\n";
    $body .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
    $body .= $corps . "\r\n\r\n";

    $body .= "--$boundary\r\n";
    $body .= "Content-Type: $fileType; name=\"$filename\"\r\n";
    $body .= "Content-Transfer-Encoding: base64\r\n";
    $body .= "Content-Disposition: attachment; filename=\"$filename\"\r\n\r\n";
    $body .= $fileContent . "\r\n";
    $body .= "--$boundary--";

} else {
    // Mail texte simple (sans pièce jointe)
    $headers  = "From: contact@cavertonpartners.fr\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $headers .= "Content-Transfer-Encoding: 8bit\r\n";

    $body = $corps;
}

$ok = mail($destinataire, $sujet, $body, $headers);

echo json_encode([
    'status'  => $ok ? 'success' : 'error',
    'message' => $ok
        ? 'Votre message a bien été envoyé !'
        : 'Échec de l\'envoi. Appelez-nous directement au 07 85 58 14 26.'
]);
