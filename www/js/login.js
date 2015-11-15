$(function() {
    $('#login-form-link').click(function(e) {
		$("#login-form").delay(100).fadeIn(100);
 		$("#register-form").fadeOut(100);
		$('#register-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});

	$('#register-form-link').click(function(e) {
		$("#register-form").delay(100).fadeIn(100);
 		$("#login-form").fadeOut(100);
		$('#login-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});

	$("#btn-login").click(function(e) {
		if(typeof param1 == 'undefined') {
			e.preventDefault();
		}
		var nombreUsuario = $("#username").val();
    	var pass = $("#password").val();
		iniciarSesion(nombreUsuario,pass);
		// Limpiamos los input text //
		$(':input','#login-form')
		  .not(':button, :submit, :reset, :hidden')
		  .val('');

		// Esto es porque como la peticion ajax tiene un pequeño retardo //
		// haciendo esto ejecutamos x cosas cuando la peticion se haya resuelto //
		d1 = $.Deferred();
		$.when( d1 ).done(function ( usuario ) {
			if(usuario!=false) {
			console.log(usuario);
				if ($('#remember').prop('checked') == true) {
					window.localStorage.setItem("usuario", usuario.nombreUsuario);
					window.localStorage.setItem("pass", usuario.pass);
				}
				$("#login-submit").click();
			}else {
				console.log("Usuario no encontrado");
			}
		});
	});
});

function iniciarSesion (nombreUsuario, pass) {
	$.ajax({
		data:  {
			"sentencia" : '0',
			"nombreUsuario" : nombreUsuario,
			"pass" : pass
		},
		url: "http://mjgr0013.esy.es/login/defaultController.php",
		type:  'post',
		beforeSend: function () {
			console.log("Buscando el usuario . . . ")
		},
		success:  function (respuesta) {
			d1.resolve( respuesta );
		}
	});
	return 1;
}

function darSesionUsuario (usuario) {
	 $.ajax({
    data:  {
    	"sentencia" : '1',
    	"idUsuario" : usuario.id
  	},
    url: "http://mjgr0013.esy.es/login/defaultController.php",
    type:  'post',
    beforeSend: function () {
      console.log("Dandole sesion a " + usuario.nombreUsuario)
    },
    success:  function (response) {
		if(response) {
			if (response != "") {
				if ($('#remember').prop('checked') == true) {
					window.localStorage.setItem("sesId", response);
				}else{
					// Sino expira cuando se cierre la app //
					setCookie('sessionId',response);
				}
			}
		}else {
			console.log("Problema al dar sesion");
		}
    }
  });
}

function comprobarSiHaySesion() {
	var usuario = window.localStorage.getItem("usuario");
	var pass = window.localStorage.getItem("pass");
	if (usuario != null && pass!= null) {
	  $.ajax({
	    data:  {
	    	"sentencia" : '0',
	    	"nombreUsuario" : usuario,
	    	"pass" : pass
	  	},
	    url: "http://mjgr0013.esy.es/login/defaultController.php",
	    type:  'post',
	    beforeSend: function () {
	    	console.log("Iniciando peticion ...")
	    },
	    success:  function (usuario) {
			if(usuario) {
				window.location.replace('html/home.html');
			}else {
				console.log("Usuario no encontrado");
			}
	    }
	  });
	}
}