<?php 
	header('content-type: application/json; charset=utf-8');
	// Para que se puedan conectar los terminales //
	header("access-control-allow-origin: *");

	date_default_timezone_set('Europe/Madrid');

	try {
		$dbh = new PDO('mysql:host=localhost;dbname=login;charset=utf8','root', '');
		$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	}
	catch (PDOException $e) {
		die('Ha ocurrido un error al conectar con la base de datos');
	}

	// Función para buscar si existe el usuario //
	function buscarUsuario ($dbh, $nombreUsuario, $pass) {
		$consulta = $dbh->prepare('SELECT * FROM usuario WHERE nombreUsuario=:nombreUsuario AND pass=:pass');
		$consulta->bindParam(':nombreUsuario', $nombreUsuario , PDO::PARAM_STR);
		$consulta->bindParam(':pass', $pass, PDO::PARAM_STR);
		$consulta->execute();
		return $consulta->fetch(PDO::FETCH_ASSOC);
	}

	// Función para buscar si existe la sesion //
	function existeSesion($dbh, $token) {
		$consulta = $dbh->prepare('SELECT * FROM sesion WHERE token=:token');
		$consulta->bindParam(':token', $token , PDO::PARAM_STR);
		$consulta->execute();
		return $consulta->fetch(PDO::FETCH_ASSOC);
	}

	// Función para registrar un usuario //
	function registrarUsuario ($dbh, $nombreUsuario, $pass) {
		$consulta = $dbh->prepare('INSERT INTO usuario (nombreUsuario, pass) VALUES (:nombreUsuario, :pass)');
		$consulta->bindParam(':nombreUsuario', $nombreUsuario , PDO::PARAM_STR);
		$consulta->bindParam(':pass', $pass , PDO::PARAM_STR);
		$consulta->execute();
		return $consulta->rowCount();
	}

	// Función para registrar una sesion //
	function registrarSesion ($dbh, $idUser) {
		$date = date('Y/m/d H:i:s');
		$date = strtotime($date);
		$date = strtotime("+10 day", $date);
		do {
			$sesion = generateRandomString(15);
		} while (null != existeSesion($dbh,$sesion));
		$consulta = $dbh->prepare('INSERT INTO sesion (idUser, token, fechaInicio, fechaFin) VALUES (:idUser, :token, :fechaInicio, :fechaFin)');
		$consulta->bindParam(':idUser', $idUser , PDO::PARAM_INT);
		$consulta->bindParam(':fechaInicio', date('Y/m/d H:i:s'), PDO::PARAM_STR);
		$consulta->bindParam(':fechaFin', date('Y/m/d H:i:s', $date) , PDO::PARAM_STR);
		$consulta->bindParam(':token', $sesion , PDO::PARAM_STR);
		$consulta->execute();
		return $sesion;
	}

	//Functión para obtener todas las sesiones //
	function dameSesiones ($dbh) {
		$consulta = $dbh->prepare('SELECT token FROM sesion ');
		$consulta->execute();
		return $consulta->fetchAll(PDO::FETCH_ASSOC);
	}

	// Función para generar una cadena aleatoria de longitud variable //
	function generateRandomString($length) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
	}

if (isset($_POST['sentencia'])) {
	switch ($_POST['sentencia']) {
    case 0:
        $resultado = buscarUsuario($dbh,$_POST['nombreUsuario'],$_POST['pass']);
        if ($resultado!=false) {
        	session_start();
					$_SESSION['user'] = $_POST['nombreUsuario'];
					$_SESSION['pass'] = $_POST['pass'];
        }
        echo json_encode($resultado);
        break;
	}
}
?>