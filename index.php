<?php

// кратность ящиков с тарой
$tares = [12, 6, 3];

// Сразу определим массивы, которые в дальнейшем будут сериализованы в JSON
$response = [];
$data = [];

// Проверим наличие значения количества бутылок в запросе
if (!isset($_GET['bottles'])) {
    $response['error'] = 'There is no number of bottles in request';
    sendJson($response);
}

// Приведём к целочисленному значению
$bottles = filter_var($_GET['bottles'], FILTER_VALIDATE_INT);

if (!$bottles) {
    $response['error'] = 'Incorrect value of bottles';
    sendJson($response);
}

/*
    По условиям задачи мы должны округлить количество бутылок до полных ящиков
    сделаем это сразу, перед циклом, и оставим сообщение об этом
*/
$smallestTare = end($tares);
if (is_float($bottles / $smallestTare)) {
    $data['message'] = 'Количество бутылок было округлено вверх, поскольку оно не кратно ящикам.';
    $bottles = ceil($bottles / $smallestTare) * $smallestTare;
}

$data['bottles'] = $bottles;

foreach ($tares as $tare) {
    $crates = (int) floor($bottles / $tare);
    if ($crates === 0) {
        continue;
    }
    $bottles = $bottles - $crates * $tare;
    $data['crates'][] = [
        'tare' => $tare,
        'crates' => $crates
    ];
}

// Возвращаем JSON
$response['data'] = $data;
sendJson($response);

function sendJson($response)
{
    header("Access-Control-Allow-Origin: *");
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($response);
    exit();
}
