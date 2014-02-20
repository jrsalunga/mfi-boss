<?php
// If it's going to need the database, then it's 
// probably smart to require it before we start.
require_once(ROOT.DS.'classes'.DS.'database.php');

class User extends DatabaseObject{
	
	protected static $table_name="user";
	protected static $db_fields = array('id', 'username' ,'firstname' ,'lastname');
	
	/*
	* Database related fields
	*/
	public $id;
	public $username;
	public $firstname;
	public $lastname;

	
	
	public static function find_all($order=NULL) {
		if(empty($order) || $order==NULL) {
			return parent::find_by_sql("SELECT * FROM ".static::$table_name. " ORDER BY lastname ASC, firstname ASC");
		} else {
			return parent::find_by_sql("SELECT * FROM ".static::$table_name." ".$order);
		}
  	}
	
	
}

