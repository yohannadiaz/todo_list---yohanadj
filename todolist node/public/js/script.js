window.onload = function()
{
	tareas = [];
	var indEdita = -1; 

	function tarea(id,estado)
	{
		this.tarea = id;
		this.estado = estado;

		this.imprime = function()
		{
			return [
						this.tarea, 
						this.estado
					];
		}
	}

	//Para los servicios que se consumirán...
	var nomServicios = [
                        {
                            servicio 	: 	"Trae todas las tareas",
                            urlServicio	: 	"getAllTask",
                            metodo		: 	"GET"
                        },
                        {
                            servicio 	: 	"Crear una nueva tarea",
                            urlServicio	: 	"createTask",
                            metodo		: 	"POST"
                        },
                        {
                            servicio 	: 	"Editar una tarea",
                            urlServicio	: 	"updateTask",
                            metodo		: 	"PUT"
                        },
                        {
                            servicio 	: 	"Eliminar Tarea",
                            urlServicio	: 	"deleteTask",
                            metodo		: 	"DELETE"
                        },
                        {
                            servicio 	: 	"Trae una sola tarea",
                            urlServicio	: 	"getTask",
                            metodo		: 	"GET"
                        }
                    ];

	var consumeServicios = function(tipo, val, callback)
	{
	    var servicio = {
	                        url 	: nomServicios[tipo - 1].urlServicio,
	                        metodo	: nomServicios[tipo - 1].metodo,
	                        datos 	: ""
	                    };
	    if(tipo === 4 || tipo === 5)
	    {
	        servicio.url += "/" + val;
	    }
	    else
	    {
	        servicio.datos = val !== "" ? JSON.stringify(val) : "";
	    }
	    //Invocar el servicio...
	    $.ajax(
	    {
	        url 		: servicio.url,
	        type 		: servicio.metodo,
	        data 		: servicio.datos,
	        dataType 	: "json",
	        contentType: "application/json; charset=utf-8"
	    }).done(function(data)
	    {
	        callback(data);
	    });
	};

	consumeServicios(1, "", function(data){
	    tareas = data;
	    imprimeUsuarios();
	});

	function imprimeUsuarios()
	{
		var txt = "";
		for(var i = 0; i < tareas.length; i++)
		{
			var datosTarea = tareas;
			if(datosTarea[i].finish == false){
				txt += "<div class='tareas' id='activada'>";
				txt += "<center>"+(datosTarea[i].task)+"</center>";
				txt += "<img src = 'img/editar1.png' border = '0' id = 'editar_"+i+"'/>";
				txt += "<img align='right' src = 'img/eliminar1.png' border = '0' id = 'eliminar_"+i+"'/>";
				txt += "</div>";
			}
			else{
				txt += "<div class='tareas' id='desactivada'>";
				txt += "<center>"+(datosTarea[i].task)+"</center>";
				txt += "<img src = 'img/editar2.png' border = '0' id = 'editar_"+i+"'/>";
				txt += "<img align='right' src = 'img/eliminar2.png' border = '0' id = 'eliminar_"+i+"'/>";
				txt += "</div>";
			}
			
		}

		nom_div("imprime").innerHTML = txt;

		for(var i = 0; i < tareas.length; i++)
		{
			
			//Editar...
			nom_div("editar_" + i).addEventListener('click', function(event)
			{
				var ind = event.target.id.split("_")[1];
				var idUser = tareas[ind].task;
				ind = buscaIndice(idUser);

				var updateData = {
                    "id"        : ind,
                    "finish"    : true,
                    "field"     : "finish"
                };
				consumeServicios(3, updateData, function(data){
				    consumeServicios(1, "", function(data){
					    tareas = data;
					    imprimeUsuarios();
					});
					limpiarCampos();
				});

			});
			//Eliminar...
			nom_div("eliminar_" + i).addEventListener('click', function(event)
			{
				var ind = event.target.id.split("_")[1];
				var idUser = tareas[ind].task;
				if(confirm("Seguro(a) que desea eliminar esta tarea?"))
				{
					ind = buscaIndice(idUser);
					consumeServicios(4, ind, function(data){
					    imprimeUsuarios();
					    
					    consumeServicios(1, "", function(data){
						    tareas = data;
						    imprimeUsuarios();
						});
						limpiarCampos();
					});
					
				}
			});
		}
		return imprimeUsuarios;
	}

	buscaIndice = function(id)
	{
		var indice = -1;
		for(var i in tareas)
		{	
			if(tareas[i].task == id)
			{
				indice = tareas[i].id;
				break;
			}
		}
		return indice;
	}

	var limpiarCampos = function()
	{	
		indEdita = -1; 
		nom_div("nueva_tarea").value = "";	
		imprimeUsuarios();
	}

	function existeTarea(id)
	{
		var existe = 0; 
		for(var i in tareas)
		{
			if(i !== indEdita)
			{
				if(tareas[i].task.trim().toLowerCase() === id.trim().toLowerCase())
				{
					existe = 1; 
					break;
				}
			}
		}
		return existe;
	}

	nom_div("agregar").addEventListener('click', function(event)
	{
		var existe = false;
		var valor = [];
		if(nom_div("nueva_tarea").value == "")
		{
			alert("Por favor digite una tarea");
			nom_div("nueva_tarea").focus();
			existe = true;
		}
		else
		{
			valor = nom_div("nueva_tarea").value;
		}
		if(existe == false)
		{
			if(existeTarea(valor) == 0) 
			{
				if(indEdita < 0)
				{
					var newToDo = {finish : false, task : valor};
					consumeServicios(2, newToDo, function(data){
					    tareas.push(data);
					});
				}
				else
				{
					tareas[indEdita].task = valor;
				}

				consumeServicios(1, "", function(data){
				    tareas = data;
				    imprimeUsuarios();
				});
				limpiarCampos();
			}
			else
			{
				alert("La tarea que digito ya existe");
				nom_div("nueva_tarea").focus();
			}
		}

	});

	function nom_div(div)
	{
		return document.getElementById(div);
	}
}