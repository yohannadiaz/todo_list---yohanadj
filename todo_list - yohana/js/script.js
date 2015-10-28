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

	if(localStorage.getItem("listado"))
	{
		var objTMP = eval(localStorage.getItem("listado"));
		var id = estado = "";
		for(var i in objTMP)
		{
			var id = objTMP[i].tarea;
			var estado = objTMP[i].estado;
			var nuevaTarea = new tarea(id,estado);
			tareas.push(nuevaTarea);
		}
	}

	var imprimeUsuarios = (function imprimeUsuarios()
	{
		var txt = "";
		for(var i = 0; i < tareas.length; i++)
		{
			var datosTarea = tareas[i].imprime();
			if(datosTarea[1] == 1){
				txt += "<div class='tareas' id='activada'>";
				txt += "<center>"+(datosTarea[0])+"</center>";
				txt += "<img src = 'img/editar1.png' border = '0' id = 'editar_"+i+"'/>";
				txt += "<img align='right' src = 'img/eliminar1.png' border = '0' id = 'eliminar_"+i+"'/>";
				txt += "</div>";
			}
			else{
				txt += "<div class='tareas' id='desactivada'>";
				txt += "<center>"+(datosTarea[0])+"</center>";
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
				var idUser = tareas[ind].tarea;
				console.log("Valor de idUser: ", idUser);
				ind = buscaIndice(idUser);
				if(ind >= 0)
				{
					tareas[ind].estado = 0;
					localStorage.setItem("listado", JSON.stringify(tareas));
					limpiarCampos();
				}
				else
				{
					alert("No existe el ID");
				}
			});
			//Eliminar...
			nom_div("eliminar_" + i).addEventListener('click', function(event)
			{
				var ind = event.target.id.split("_")[1];
				var idUser = tareas[ind].tarea;
				if(confirm("Seguro(a) que desea eliminar esta tarea?"))
				{
					ind = buscaIndice(idUser);
					if(ind >= 0)
					{
						tareas.splice(ind, 1);
						localStorage.setItem("listado", JSON.stringify(tareas));
						indEdita = -1;
						imprimeUsuarios();
					}
				}
			});
		}
		return imprimeUsuarios;
	})();

	var buscaIndice = function(id)
	{
		var indice = -1;
		for(var i in tareas)
		{	
			if(tareas[i].tarea == id)
			{
				indice = i;
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
				if(tareas[i].tarea.trim().toLowerCase() === id.trim().toLowerCase())
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
					var nuevaTarea = new tarea(valor,1);
					tareas.push(nuevaTarea);
				}
				else
				{
					tareas[indEdita].tarea = valor;
				}

				localStorage.setItem("listado", JSON.stringify(tareas));
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