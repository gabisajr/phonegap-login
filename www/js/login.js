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

	$("#login-submit").click(function(e) {
		iniciarSesion();
		$(':input','#login-form')
		  .not(':button, :submit, :reset, :hidden')
		  .val('');
	});

	$('#login-form').keypress(function (e) {
 		var key = e.which;
		if(key == 13){  // the enter key code
		  $("#login-submit").click();
		}
});

});

function iniciarSesion () {
	var nombreUsuario = $("#username").val();
	var pass = $("#password").val();

  $.ajax({
    data:  {
    	"sentencia" : '0',
    	"nombreUsuario" : nombreUsuario,
    	"pass" : pass
  	},
    url: "php/defaultController.php",
    type:  'post',
    beforeSend: function () {
    	console.log("Iniciando peticion ...")
    },
    success:  function (usuario) {
			if(usuario) {
				if ($('#remember').prop('checked') == true) {
					window.localStorage.setItem("usuario", usuario.nombreUsuario);
					window.localStorage.setItem("pass", usuario.pass);
				}
				window.location.replace('html/home.html');
			}else {
				console.log("Usuario no encontrado");
			}
    }
  });
}

function darSesionUsuario (usuario) {
	 $.ajax({
    data:  {
    	"sentencia" : '1',
    	"idUsuario" : usuario.id
  	},
    url: "php/defaultController.php",
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
	    url: "php/defaultController.php",
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