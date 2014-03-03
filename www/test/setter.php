<?php
include_once('../../lib/initialize.php');




class Person {
	
	//protected static $databae_table="person";
	//protected static $database_fields = array('id', 'firstname', 'lastname', 'middlename', 'age');
	
	public $firstname;
	public $lastname;
	public $age;
	
	public function set($key=FALSE, $val=FALSE){
		
		if(gettype($key)=='object' || gettype($key)=='array'){		
			if(gettype($key)=='object'){
				$key = (array) $key;	
			}
			
			foreach($key as $k => $v){
				if(property_exists($this, $k)) {
	    			$this->$k = $v;
	    		}
			}
		} else {
			$this->$key = $val;	
		}
		
		
		
		
	}
}


$a = array('firstname'=>'Jefferson', 'lastname'=>'Salunga', 'age'=> 28);
$o = (object) $a;


var_dump($a);
echo '<br>';
var_dump($o);
echo '<br>';
echo '<br>';
$p1 = new Person();
$p1->set($a);
echo '<br>';
echo json_encode($p1);

echo '<br>';
echo '<br>';
$p2 = new Person();
$p2->set('firstname','Romeo');
$p2->set('lastname','Garcia');
$p2->set('age',20);
$p2->set('email','romeo@example.com');
echo json_encode($p2);

echo '<br>';
echo '<br>';
$u = new User();
$u->code = 'Jefferson';
$u->descriptor = 'Salunga';
echo json_encode($u);



?>