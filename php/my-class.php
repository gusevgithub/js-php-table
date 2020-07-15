<?php
require_once('db.php');

class myClass
{

  public function __construct() {}

  public function getPagination($page) {
    $pagination = self::getMethod($page);
    return $pagination;
  }

  // Вспомогательная функция для запросов в БД и вывода данных используя фильтры
  public function getSwitch($get_two, $name_parameter, $get_search, $page) {
    // Вывод количество записей за один запрос (на странице строки)
    $kol = 5;
    // Если номер страницы, то устанавливаем номер записи, с которой нужно выводить данные.
    if($page) {
      $art = ceil($kol * (int)$page);   
    } else {
      $art = 0;
    }
    // Если выбор select (выбор какого либо условия), то вставляем данные для вывода из БД.
    switch($get_two) {
      case 'equalTo':
        $result = tableData::getDataAll($name_parameter, '=', $get_search, $kol, $art);
        return $result;
      break;
      case 'contains':
        $result = tableData::getDataAll($name_parameter, 'LIKE', $get_search, $kol, $art); 
        return $result;
      break;
      case 'greaterThan':
        $result = tableData::getDataAll($name_parameter, '>', $get_search, $kol, $art); 
        return $result;
      break;
      case 'lessThan':
        $result = tableData::getDataAll($name_parameter, '<', $get_search, $kol, $art); 
        return $result;
      break;
      default:
        $result = tableData::getDataAll($name_parameter, 'LIKE', "", $kol, $art);       
        return $result;
      break;
    }
  }

  // Функция для запросов в БД и вывода данных используя фильтры
  public function getMethod($get_one, $get_two, $get_search, $page) {
    // Вывод количество записей за один запрос (на странице строки)
    $kol = 5;
    // Если номер страницы, то устанавливаем номер записи, с которой нужно выводить данные.
    if($page) {
      $art = ceil($kol * (int)$page);   
    } else {
      $art = 0;
    }
   // Если input type="text" не пустой и задан первый select (выбрать столбец),
   // то вызываем вспомогательную функцию getSwitch() для вывода результата.
   if($get_search !== '' && $get_search !== false) {
    switch($get_one) {
      case 'nameProduct':
        $result = self::getSwitch($get_two, 'name_product', $get_search, $page);
        return $result;
      break;
      case 'quantity':
        $result = self::getSwitch($get_two, 'quantity', $get_search, $page);
        return $result;
      break;
      case 'distance':
        $result = self::getSwitch($get_two, 'distance', $get_search, $page);
        return $result;
      break;
    }

   } else {
    // Запрос к БД и вывод данных по умолчанию.
    $result = tableData::getDataAll('name_product', 'LIKE', "", $kol, $art);       
    return $result;
   }
  }

}