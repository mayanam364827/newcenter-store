<?php
declare(strict_types=1);

require_once __DIR__ . "/_auth.php";
require_admin();

header("Content-Type: application/json; charset=utf-8");

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!is_array($data)) {
  http_response_code(400);
  echo json_encode(["ok" => false, "error" => "Body must be JSON object"], JSON_UNESCAPED_UNICODE);
  exit;
}
if (!isset($data["products"]) || !is_array($data["products"])) {
  http_response_code(400);
  echo json_encode(["ok" => false, "error" => "Missing field: products[]"], JSON_UNESCAPED_UNICODE);
  exit;
}

$out = [
  "updated_at" => gmdate("c"),
  "products" => []
];

foreach ($data["products"] as $p) {
  if (!is_array($p)) continue;

  $prod = [
    "id" => (string)($p["id"] ?? ""),
    "series" => (string)($p["series"] ?? ""),
    "name" => (string)($p["name"] ?? ""),
    "hot" => (bool)($p["hot"] ?? false),
    "thumb" => (string)($p["thumb"] ?? ""),
    "gallery" => is_array($p["gallery"] ?? null) ? array_values($p["gallery"]) : [],
    "variants" => []
  ];

  $vars = is_array($p["variants"] ?? null) ? $p["variants"] : [];
  foreach ($vars as $v) {
    if (!is_array($v)) continue;
    $prod["variants"][] = [
      "storage" => (string)($v["storage"] ?? ""),
      "price" => (int)($v["price"] ?? 0),
      "sale_price" => (int)($v["sale_price"] ?? 0),
    ];
  }

  if ($prod["id"] !== "" && $prod["name"] !== "") {
    $out["products"][] = $prod;
  }
}

$path = __DIR__ . "/../data/products.json";
$tmp  = $path . ".tmp";

$json = json_encode($out, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
if ($json === false) {
  http_response_code(500);
  echo json_encode(["ok" => false, "error" => "Failed to encode JSON"], JSON_UNESCAPED_UNICODE);
  exit;
}

if (file_put_contents($tmp, $json, LOCK_EX) === false) {
  http_response_code(500);
  echo json_encode(["ok" => false, "error" => "Failed to write temp file. Check permissions for /data"], JSON_UNESCAPED_UNICODE);
  exit;
}

if (!rename($tmp, $path)) {
  http_response_code(500);
  echo json_encode(["ok" => false, "error" => "Failed to replace products.json. Check permissions for /data"], JSON_UNESCAPED_UNICODE);
  exit;
}

echo json_encode(["ok" => true, "updated_at" => $out["updated_at"], "count" => count($out["products"])], JSON_UNESCAPED_UNICODE);
