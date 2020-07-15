<?php

/**
 * Application configuration
 *
 * PHP version 7.1
 */
class Config
{

    /**
     * Database host
     * @var string
     */
    const DB_HOST = 'localhost';

    /**
     * Database name
     * @var string
     */
    const DB_NAME = 'table_data';

    /**
     * Database user
     * @var string
     */
    const DB_USER = '';

    /**
     * Database password
     * @var string
     */
    const DB_PASSWORD = '';

}

/**
 * Base model
 *
 * PHP version 7.1
 */

abstract class Model
{

    /**
     * Get the PDO database connection
     *
     * @return mixed
     */
    protected static function getDB()
    {
        static $db = null;

        if ($db === null) {
            $dsn = 'mysql:host=' . Config::DB_HOST . ';dbname=' . Config::DB_NAME . ';charset=utf8';
            $db = new PDO($dsn, Config::DB_USER, Config::DB_PASSWORD);

            // Throw an Exception when an error occurs
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }

        return $db;
    }
}

/**
 * Post model
 *
 * PHP version 7.1
 */

class tableData extends Model

{
	
    public function __construct() {}
    
    public static function getDataAll($parameter, $operator, $search, $kol, $art)
	{

    try {
        $db = static::getDB();
            if($operator === 'LIKE') {
                $search = "%$search%";
            }
            if($search !== '') {
                $where = "WHERE {$parameter} {$operator} ? ORDER BY `id` DESC LIMIT {$kol} OFFSET {$art}";
            } else {
                $where = "ORDER BY `id` DESC LIMIT {$kol} OFFSET {$art}";
            }
           
            $stmt = $db->prepare(
                "SELECT * FROM `products`
                {$where}");
            $stmt->execute([$search]);
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Вывод количества записей и добавление в массив данных
            $cnt = $db->prepare(
                "SELECT COUNT(*) FROM `products` 
                 WHERE {$parameter} {$operator} ?");
            $cnt->execute([$search]);
            $count = $cnt->fetchAll(PDO::FETCH_ASSOC);

             if($results[0] !== null) {
                array_unshift($results[0], $count[0], $kol, $art);
                $pages = ceil($results[0][0]['COUNT(*)'] / $results[0][1]);
                array_unshift($results[0], $pages);
            } 
            return $results;

        } catch(PDOExpetion $e) {
            echo $e->getMessage();
        }
	} 
		
}

