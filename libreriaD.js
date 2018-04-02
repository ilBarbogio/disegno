//libreria.js
//un test per creare una libreria di disegno

(function(window){

  //La libreria come funzione
  function libreriaD(){
    var _libreriaD = {};

		//*************************VARIABILI*******************
		//tecniche
		var canvasId="telaID";
		var canvas;
		var ctx;
		var canvasX,canvasY;
		var orologio;
		var timeStamp=0;
		var deltaTime=20;
		var uniqueId=0;
		var codaDisegno=[];
		

		//opzioni di disegno
		var opzioniDisegno={
			coloreSfondo:"#FFFFFF",
			coloreTratto:"#000000",
			traccia:true,
			coloreRiempimento:"#000000",
			riempi:false,
			spessoreTratto:1,
			capiLinee:"round", //bevel,round,miter
			giuntiLinee:"round" //butt,round,square
		}
		var opzioniDisegnoTemp={
			coloreSfondo:"#FFFFFF",
			coloreTratto:"#000000",
			traccia:true,
			coloreRiempimento:"#000000",
			riempi:false,
			spessoreTratto:1,
			capiLinee:"round", //butt,round,square
			giuntiLinee:"round" //bevel,round,miter
		}

		


		//*************************METODI*******************
		//da chiamare per primissima cosa, imposta la canvas TODO estenedere a più layer
		_libreriaD.creaTela=function(larghezza, altezza, dove){
			var contenitore;
			canvasX=larghezza;
			canvasY=altezza;
			if(dove==null){contenitore=document.querySelector("body");}
			else{contenitore=document.getElementById(dove);}
			contenitore.innerHTML="<canvas id="+canvasId+" width=\""+canvasX+"px\" height=\""+canvasY+"px\"></canvas>";
			canvas=document.getElementById(canvasId);
			ctx=canvas.getContext("2d");
			//valori di default
			this.impostaOpzioniDisegno();

			//imposta l'origine degli assi e il verso dell'asse y "standard"
			ctx.translate(0,canvasY);
			ctx.scale(1,-1);
		};

		
		//OPZIONI DISEGNO
		//reimposta tutte le opzioni, prendendole dalla raccolta di variabili
		_libreriaD.impostaOpzioniDisegno=function(){
			ctx.strokeStyle=opzioniDisegno.coloreTratto;
			ctx.lineWidth=opzioniDisegno.spessoreTratto;
			ctx.fillStyle=opzioniDisegno.coloreRiempimento;
			ctx.lineCap=opzioniDisegno.capiLinee;
			ctx.lineJoin=opzioniDisegno.giuntiLinee;
		}
		//slva le opzioni di disegno in una variabile temporanea
		_libreriaD.salvaOpzioniDisegno=function(){
			opzioniDisegnoTemp.coloreTratto=opzioniDisegno.coloreTratto;
			opzioniDisegnoTemp.spessoreTratto=opzioniDisegno.spessoreTratto;
			opzioniDisegnoTemp.coloreRiempimento=opzioniDisegno.coloreRiempimento;
			opzioniDisegnoTemp.capiLinee=opzioniDisegno.capiLinee;
			opzioniDisegnoTemp.giuntiLinee=opzioniDisegno.giuntiLinee;
		}
		//carica le opzioni dalla variabile temporanea
		_libreriaD.caricaOpzioniDisegno=function(){
			opzioniDisegno.coloreTratto=opzioniDisegnoTemp.coloreTratto;
			opzioniDisegno.spessoreTratto=opzioniDisegnoTemp.spessoreTratto;
			opzioniDisegno.coloreRiempimento=opzioniDisegnoTemp.coloreRiempimento;
			opzioniDisegno.capiLinee=opzioniDisegnoTemp.capiLinee;
			opzioniDisegno.giuntiLinee=opzioniDisegnoTemp.giuntiLinee;
		}
		//imposta i vari stili, modificando la raccolta degli stili attuali
		_libreriaD.tratto=function(colore){
			if(colore!=null){
				opzioniDisegno.coloreTratto=colore;
				this.impostaOpzioniDisegno();
				traccia=true;
			}else{
				traccia=false;
			}
		}
		_libreriaD.spessore=function(spessore){
			if(spessore>0){
				opzioniDisegno.spessoreTratto=spessore;
				this.impostaOpzioniDisegno();
				traccia=true;
			}else{
				traccia=false;
			}
		}
		_libreriaD.riempimento=function(colore){
			if(colore!=null){
				opzioniDisegno.coloreRiempimento=colore;
				this.impostaOpzioniDisegno();
				riempi=true;
			}else{riempi=false;}
		}
		_libreriaD.capi=function(capi){
			if(capi=="round"||capi=="butt"||capi=="square"){
				opzioniDisegno.capiLinee=capi;
				this.impostaOpzioniDisegno();
				riempi=true;
			}
		}
		_libreriaD.giunti=function(giunti){
			if(capi=="round"||capi=="bevel"||capi=="miter"){
				opzioniDisegno.giuntiLinee=giunti;
				this.impostaOpzioniDisegno();
				riempi=true;
			}
		}
		_libreriaD.sfondo=function(colore){
			canvas.style.backgroundColor=colore;
		}
		_libreriaD.cancella=function(){
			ctx.clearRect(0,0,canvasX,canvasY);
		}

		//avvia il ciclo di animazione passando il contesto, per chiamare le funzioni pubbliche
		_libreriaD.anima=function(){
			contesto=this;
			orologio=setInterval(function(){ciclo(contesto);},deltaTime);
		}
		//ciclo di animazione vero e proprio
		var ciclo=function(contesto){
			contesto.cancella();
			codaDisegno.forEach(function(item){
				disegna(item);
			});
			timeStamp++;
		}
		//smista le chiamate al disegno dei vari oggetti
		var disegna=function(oggetto){
			switch(oggetto.tipo){
				case "punto":
				disegnaPunto(oggetto);
				break;
				case "linea":
				disegnaLinea(oggetto);
				break;
			}
		}

		//figure base
		_libreriaD.punto=function(Xa,Ya){
			var identita=uniqueId;
			uniqueId++;
			var oggetto={
				id:identita,
				tipo:"punto",
				colore:[opzioniDisegno.coloreTratto],
				spessore:[opzioniDisegno.spessoreTratto],
				angolo:[0],
				posizione:[[Xa,Ya]]
			}
			codaDisegno.push(oggetto);

			this.trasla=function(X,Y,tempo){
				var indice=oggetto.posizione.length;
				var valore=oggetto.posizione[indice-1];
				var passi=tempo/deltaTime;
				var passoX=X/passi;
				var passoY=Y/passi;
				for(var i=0;i<passi-1;i++){
					oggetto.posizione.push([valore[0]+i*passoX,valore[1]+i*passoY]);
				}
				oggetto.posizione.push([valore[0]+X,valore[1]+Y]);
			}
		}

		var disegnaPunto=function(oggetto){
			var posizione=oggetto.posizione[Math.min(timeStamp,oggetto.posizione.length-1)];
			var colore=oggetto.colore[Math.min(timeStamp,oggetto.colore.length-1)];
			var spessore=oggetto.spessore[Math.min(timeStamp,oggetto.spessore.length-1)];
			ctx.fillStyle=colore;
			ctx.beginPath();
			ctx.arc(posizione[0],posizione[1],spessore,0,2*Math.PI);
			ctx.fill();
		}

		_libreriaD.linea=function(Xa,Ya,Xb,Yb){
			var identita=uniqueId;
			uniqueId++;
			var oggetto={
				id:identita,
				tipo:"linea",
				colore:[opzioniDisegno.coloreTratto],
				spessore:[opzioniDisegno.spessoreTratto],
				angolo:[0],
				posizione:[[Xa,Ya,Xb,Yb]]
			}
			codaDisegno.push(oggetto);

			this.trasla=function(X,Y,tempo){
				var indice=oggetto.posizione.length;
				var valore=oggetto.posizione[indice-1];
				var passi=tempo/deltaTime;
				var passoX=X/passi;
				var passoY=Y/passi;
				for(var i=0;i<passi-1;i++){
					oggetto.posizione.push([valore[0]+i*passoX,valore[1]+i*passoY,valore[2]+i*passoX,valore[3]+i*passoY]);
				}
				oggetto.posizione.push([valore[0]+X,valore[1]+Y,valore[2]+X,valore[3]+Y]);
			}
		}

		var disegnaLinea=function(oggetto){
			var posizione=oggetto.posizione[Math.min(timeStamp,oggetto.posizione.length-1)];
			var colore=oggetto.colore[Math.min(timeStamp,oggetto.colore.length-1)];
			var spessore=oggetto.spessore[Math.min(timeStamp,oggetto.spessore.length-1)];
			ctx.strokeStyle=colore;
			ctx.lineWidth=spessore;
			ctx.beginPath();
			ctx.moveTo(posizione[0],posizione[1]);
			ctx.lineTo(posizione[2],posizione[3]);
			ctx.stroke();
		}


    return _libreriaD;
  }

  //Salvo la variabile in window per renderla accessibile
  if(typeof(window.D) === 'undefined'){
    window.D = libreriaD();
  }
})(window); //eseguo la funzione su window al caricamento della libreria