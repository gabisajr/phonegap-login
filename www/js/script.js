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
    url: "php/server.php",
    type:  'post',
    beforeSend: function () {
            console.log("Iniciando peticion ...")
    },
    success:  function (usuario) {
			if(usuario) {
				registrarUsuario(usuario);
			}else {
				console.log("Usuario no encontrado");
			}
    }
  });
}

function registrarUsuario (usuario) {
	 $.ajax({
    data:  {
    	"sentencia" : '1',
    	"idUsuario" : usuario.id
  	},
    url: "php/server.php",
    type:  'post',
    beforeSend: function () {
      console.log("Dandole sesion a " + usuario.nombreUsuario)
    },
    success:  function (response) {
			if(response) {
				if (response == 1) {
					
				};
			}else {
				console.log("Problema al dar sesion");
			}
    }
  });
}