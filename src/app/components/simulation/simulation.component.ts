import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.css']
})
export class SimulationComponent implements OnInit {

  	public generals: number; 				// Generales
	public traitors: number; 				// Traidores
	public barracks: Array<number> = []; 	// Cuartel

	public orden: boolean;							// Orden final
	public generales_leales: number;				// Total de Generales Leales
	public generales_traidores: number;				// Total de Generales Traidores
	public ordenes_recibidas: Array<any> = []; 		// Total de Órdenes recibidas
	public ordenes_ejecutadas: Array<any> = []; 	// Total de Órdenes ejecutadas

	// Estadisticas

	charGenerals: Chart;
	charGeneralsRecibe: Chart;
	charGeneralsEjecute: Chart;
	datasetsGR: any = [];


	constructor() {
		this.generales_leales= 50;
		this.generales_traidores= 50;
	 }

	ngOnInit() {
		this.initSimulation();
		this.startSimulation();
	}

	/* Función que inicializa las varibles principales de la simulación */

	public initSimulation()
	{
		// Inicializamos las variables de la simulación

		this.generals = 0;
		this.traitors = 0;
		this.barracks = [];
		this.generales_leales= 0;
		this.generales_traidores= 0;
		this.ordenes_recibidas= []; 		
		this.ordenes_ejecutadas= [];
	}


  	/* Función que inicia la simulación */

	public startSimulation()
	{
		// console.log("Start");

		do {

			this.generals= this.getRandomInt(0, 101);
			this.traitors= this.getRandomInt(0, 101);
  			
  			if (this.generals >= (( 3 * this.traitors)+1) )
  			{
  				// console.log("Cantidad de Generales: "+this.generals);
  				this.generales_leales= this.generals;
  				// console.log("Cantidad de Traidores: "+this.traitors);
  				this.generales_traidores= this.traitors;

  				break;
  			} 	
  				
  			
  		} while (true);

  		console.log("Generales y traidores: "+this.generals+" "+this.traitors);

  		var v = 0;
  		var j = 0;
  		var max = 0;

  		for (var i = 0; i < this.generals; i++) 
  		{
  			this.barracks.push(1);
  		}
  			
		j= 100;
		max= (this.generals - this.traitors);

		while(j > max)
		{
			j= this.getRandomInt(0, this.generals);
		}
		
		if (j==0)
		{
			j++;
		}

		max= j + this.traitors; 

		// console.log("max: "+max+" j: "+j);

		for (v = j; v < max; v++) 
		{
			this.barracks[v]= 0;
			// console.log("O Generales "+v+" Traidores");
		}

		var message_initial = this.getRandomInt(0, 2);
		// console.log(message_initial);

		// console.log("La orden del comandante general es:");

		if (message_initial==0)
		{
			// console.log("Retirar");
			this.orden= false;
		}
		else
		{
			// console.log("Atacar");
			this.orden= true;
		}


		var ordenGeneral;

		for (var i = 0; i < this.generals; i++) 
		{
			console.log("General: "+i+" "+this.barracks[i]+" ");
			
			ordenGeneral= this.barracks[i];

			console.log(i);

			this.ordenes_recibidas.push({

				general: i,
				orden: this.barracks[i],

			});
		}

		var message_received = [];

		message_received.push(message_initial);
		var utilizados = [];

		this.OM(1, message_received, message_initial, 0, this.barracks, utilizados);
		console.log('estadisticas');
		this.showStadistics();

	}


	public OM(traitors, grade, message, comandant, barracks, utilizados)
	{
		var i;
		var j;
		
		utilizados.push(comandant);

		if (barracks[comandant] == 0)
		{
			for (i = 0; i < this.generals; i++)
			{
				message = this.getRandomInt(0, 9);

				if (utilizados[0]==comandant)
					grade.push(message);
			}
		}
		else
		{
			for (i = 0; i < this.generals; i++)
			{
				if (utilizados[0]==comandant)
				{
					grade.push(message);
				}
			}
		}

		console.log("Mensaje recibido por los Generales");


		for (i = 0; i < this.generals; i++)
		{
			// console.log("Teniente "+i+" :");

			for (j = 0; j < grade.length; j++)
			{
				// console.log(grade[i]+" ");
				this.ordenes_ejecutadas.push(grade[i]);
			}
		}

		if (traitors==0)
		{
			console.log("Este es el úlitmo nivel");
		}

		for (i = 1; i < this.generals; i++)
		{
			if (utilizados[i]==comandant)
			{
				grade[i]= 1 - traitors;

				this.OM(1, grade, grade[i], i, barracks, utilizados);
			}
		}

	}


	/* Función incompleta... Terminar. */

	public votacao(comandante, num_votos, grade)
	{
		var voto0, voto1, votoX, apurado, maior;
		var resultado, temp;
		var urna = [];

		for (var i = 0; i < num_votos; i++) 
		{
			urna.push("");
		}

		console.log("La orden dada por los tenientes del general "+comandante+" sao: ");
	
	}

  	/* Función que detiene la simulación */

  	public resetSimulation()
  	{
  		this.initSimulation();
  		this.clearStadistics();
  		this.startSimulation();
  	}

  	public clearStadistics()
  	{
  		if (this.charGenerals) this.charGenerals.destroy();
	    if (this.charGeneralsRecibe) this.charGeneralsRecibe.destroy();
	    if (this.charGeneralsEjecute) this.charGeneralsEjecute.destroy();
  	}


  	/* Función que muestras las estadisticas de la simulación */

  	public showStadistics()
  	{
  		// Cargamos el componente de Estadisticas

  		// Mostramos la cantidad de generales leales y generales traidores

	  	this.charGenerals = new Chart('Generals', {
	  		type: 'pie',
	  		data: {
	  			labels: ['Generales Leales', 'Generales Traidores'],
	  			datasets: [{
	  				data: [this.generales_leales, this.generales_traidores ],
	  				backgroundColor: [
              'rgb(54, 162, 235)',
              'rgb(57, 237, 48)'
            ],
	  			}]
	  		},
	  		options: {
	  			title: {
            		display: true,
            		text: 'Cantidad de Generales Leales y Traidores',
            		fontSize: 20
        		}
	  		}
	  	});

	  	// Inicializamos la cantidad de órdenes (Atacar/Retirarse)

	  	var ordenAtacar = 0;
	  	var ordenRetirarse = 0;

	  	console.log(this.ordenes_recibidas);

	  	this.ordenes_recibidas.forEach(item => {

	  		// console.log(item);

	  		if (item.orden==1) { 
	  			ordenAtacar+= 1;
	  		} else {
	  			ordenRetirarse+= 1;
	  		}
	  	});

	  	// Mostramos la cantidad de órdenes (Atacar/Retirarse)

	  	this.charGeneralsRecibe = new Chart('GeneralsRecibe', {
	  		type: 'pie',
	  		data: {
	  			labels: ['Órdenes de Atacar', 'Órdenes de Retirarse'],
	  			datasets: [{
	  				data: [ordenAtacar, ordenRetirarse],
	  				backgroundColor: [
              'rgb(54, 162, 235)',
              'rgb(57, 237, 48)'
            ],
	  			}]
	  		},
	  		options: {
	  			title: {
            		display: true,
            		text: 'Cantidad de Órdenes Recibidas por los Generales ',
            		fontSize: 20
        		}
	  		}
	  	});


	  	var ordenAtacar1 = 0;
	  	var ordenRetirarse1 = 0;

	  	this.ordenes_ejecutadas.forEach(item => {

	  		if (item==1) { 
	  			ordenAtacar1+= 1;
	  		} else {
	  			ordenRetirarse1+= 1;
	  		}
	  	});

	  	// Mostramos la cantidad de órdenes (Atacar/Retirarse)

	  	this.charGeneralsEjecute = new Chart('GeneralsEjecute', {
	  		type: 'pie',
	  		data: {
	  			labels: ['Órdenes de Atacar', 'Órdenes de Retirarse'],
	  			datasets: [{
	  				data: [ordenAtacar1, ordenRetirarse1],
	  				backgroundColor: [
              'rgb(54, 162, 235)',
              'rgb(57, 237, 48)'
            ],
	  			}]
	  		},
	  		options: {
	  			title: {
            		display: true,
            		text: 'Cantidad de Órdenes Ejecutadas por los Generales',
            		fontSize: 20
        		}
	  		}
	  	});
  	}


  	// Retorna un entero aleatorio entre min (incluido) y max (excluido)
	// ¡Usando Math.round() te dará una distribución no-uniforme!
	public getRandomInt(min, max) 
	{
		return Math.floor(Math.random() * (max - min)) + min;
	}

}
