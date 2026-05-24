<?php
declare(strict_types=1);

require_once __DIR__ . "/_auth.php";
require_admin();

header("Content-Type: application/json; charset=utf-8");

if (!isset($_FILES["file"])) {
  http_response_code(400);
  echo json_encode(["ok"=>false,"error"=>"No file field"], JSON_UNESCAPED_UNICODE);
  exit;
}

$f = $_FILES["file"];
if ($f["error"] !== UPLOAD_ERR_OK) {
  http_response_code(400);
  echo json_encode(["ok"=>false,"error"=>"Upload error: ".$f["error"]], JSON_UNESCAPED_UNICODE);
  exit;
}

$allowed = ["image/jpeg"=>"jpg","image/png"=>"png","image/webp"=>"webp"];
$mime = mime_content_type($f["tmp_name"]);
if (!isset($allowed[$mime])) {
  http_response_code(400);
  echo json_encode(["ok"=>false,"error"=>"Unsupported image type"], JSON_UNESCAPED_UNICODE);
  exit;
}

$uploadsDir = realpath(__DIR__ . "/../uploads");
if ($uploadsDir === false) {
  http_response_code(500);
  echo json_encode(["ok"=>false,"error"=>"uploads directory missing"], JSON_UNESCAPED_UNICODE);
  exit;
}

$ext = $allowed[$mime];
$name = "img_" . gmdate("Ymd_His") . "_" . bin2hex(random_bytes(6)) . "." . $ext;
$dest = $uploadsDir . DIRECTORY_SEPARATOR . $name;

if (!move_uploaded_file($f["tmp_name"], $dest)) {
  http_response_code(500);
  echo json_encode(["ok"=>false,"error"=>"Failed to move uploaded file"], JSON_UNESCAPED_UNICODE);
  exit;
}

$scheme = (!empty($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] !== "off") ? "https" : "http";
$url = $scheme . "://" . $_SERVER["HTTP_HOST"] . "/uploads/" . $name;

echo json_encode(["ok"=>true,"url"=>$url], JSON_UNESCAPED_UNICODE);
