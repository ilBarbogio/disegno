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
			coloreSfondo:[255,255,255],
			coloreTratto:[0,0,0],
			traccia:true,
			coloreRiempimento:[0,0,0],
			riempi:false,
			spessoreTratto:1,
			capiLinee:"round", //bevel,round,miter
			giuntiLinee:"round", //butt,round,square
			stileInterpolazioni:"lineare"
		}
		var opzioniDisegnoTemp={
			coloreSfondo:"#FFFFFF",
			coloreTratto:"#000000",
			traccia:true,
			coloreRiempimento:"#000000",
			riempi:false,
			spessoreTratto:1,
			capiLinee:"round", //butt,round,square
			giuntiLinee:"round", //bevel,round,miter
			stileInterpolazioni:"lineare"
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
			opzioniDisegno.coloreTratto=this.parseColore(colore);
			this.impostaOpzioniDisegno();
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
			opzioniDisegno.coloreRiempimento=this.parseColore(colore);
			this.impostaOpzioniDisegno();
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
		_libreriaD.stileInterpolazioni=function(stile){
			opzioniDisegno.stileInterpolazioni=stile;
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
			//contesto.cancella();
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
				case "cerchio":
				disegnaCerchio(oggetto);
				break;
			}
		}

		//intercala i valori per le code di animazione
		_libreriaD.intercalare=function(iniziale,aggiunta,tempo,stile){
			var temp=[];
			var passi=tempo/deltaTime;
			if(stile=="lineare"){ //INTERPOLAZIONE LINEARE - velocità costante
				switch(typeof(iniziale)){
					case "number": //se il valore è un singolo numero
					var delta=aggiunta/passi;
					for(var i=1;i<passi;i++){
						temp.push(iniziale+i*delta);
					}
					temp.push(iniziale+aggiunta);
					return temp;
					break;
					case "object": //se abbiamo un oggetto, pensando a un array
					if(Array.isArray(iniziale)){
						var delta=[];
						for(var j=0;j<iniziale.length;j++){//definisco un vettore di incrementi
							delta.push(aggiunta[j]/passi);
						}
						for(var i=1;i<passi;i++){
							var tempPasso=[];
							for(var j=0;j<delta.length;j++){
								tempPasso.push(iniziale[j]+i*delta[j]);
							}
							temp.push(tempPasso);
						}
						var ultimoPasso=[];
						for(var j=0;j<iniziale.length;j++){//definisco un vettore di incrementi
							ultimoPasso.push(iniziale[j]+aggiunta[j]);
						}
						temp.push(ultimoPasso);
					}
					return temp;
					break;
				}
			}
			else if(stile=="introduci"){ //INTERPOLAZIONE LISCIATA <---- DA FARE!!!
				switch(typeof(iniziale)){
					case "number": //se il valore è un singolo numero
					var delta=aggiunta/passi;
					var tappa=Math.floor(passi/5);
					var scarto=0;
					for(var i=1;i<passi;i++){
						if(i<tappa){temp.push(iniziale+i*delta-delta*1/(i+1));scarto+=delta*1/(i+1);console.log(delta*1/(i+1))}
						else if(i==tappa){temp.push(iniziale+i*delta-delta*1/(i+1));delta+=scarto/(passi-tappa);console.log(scarto)}
						else temp.push(iniziale+i*delta);
					}
					temp.push(iniziale+aggiunta);
					return temp;
					break;
					case "object": //se abbiamo un oggetto, pensando a un array
					if(Array.isArray(iniziale)){
						var delta=[];
						for(var j=0;j<iniziale.length;j++){//definisco un vettore di incrementi
							delta.push(aggiunta[j]/passi);
						}
						for(var i=1;i<passi;i++){
							var tempPasso=[];
							for(var j=0;j<delta.length;j++){
								tempPasso.push(iniziale[j]+i*delta[j]);
							}
							temp.push(tempPasso);
						}
						var ultimoPasso=[];
						for(var j=0;j<iniziale.length;j++){//definisco un vettore di incrementi
							ultimoPasso.push(iniziale[j]+aggiunta[j]);
						}
						temp.push(ultimoPasso);
					}
					return temp;
					break;
				}
			}
			return false;
		}

		//FIGURE BASE
		_libreriaD.punto=function(Xa,Ya){
			var identita=uniqueId;
			uniqueId++;
			var oggetto={
				id:identita,
				tipo:"punto",
				stileInterpolazioni:opzioniDisegno.stileInterpolazioni,
				colore:[opzioniDisegno.coloreTratto],
				spessore:[opzioniDisegno.spessoreTratto],
				angolo:[0],
				posizione:[[Xa,Ya]]
			}
			codaDisegno.push(oggetto);

			this.trasla=function(X,Y,tempo){
				var indice=oggetto.posizione.length;
				var valore=oggetto.posizione[indice-1];
				var aggiunta=[X,Y];
				oggetto.posizione=oggetto.posizione.concat(_libreriaD.intercalare(valore,aggiunta,tempo,oggetto.stileInterpolazioni));
			}

			this.sfuma=function(aggiunta,tempo){
				var indice=oggetto.colore.length;
				var valore=oggetto.colore[indice-1];
				oggetto.colore=oggetto.colore.concat(_libreriaD.intercalare(valore,aggiunta,tempo,oggetto.stileInterpolazioni));
			}
			this.dimensiona=function(misura,tempo){
				var indice=oggetto.spessore.length;
				var valore=oggetto.spessore[indice-1];
				oggetto.spessore=oggetto.spessore.concat(_libreriaD.intercalare(valore,misura,tempo,oggetto.stileInterpolazioni));
			}
		}

		var disegnaPunto=function(oggetto){
			var posizione=oggetto.posizione[Math.min(timeStamp,oggetto.posizione.length-1)];
			var colore=oggetto.colore[Math.min(timeStamp,oggetto.colore.length-1)];
			var spessore=oggetto.spessore[Math.min(timeStamp,oggetto.spessore.length-1)];
			ctx.fillStyle=RGBDaArray(colore);
			ctx.beginPath();
			ctx.arc(posizione[0],posizione[1],spessore,0,2*Math.PI);
			ctx.fill();
		}

		_libreriaD.linea=function(Xa,Ya,Xb,Yb,offset){
			var identita=uniqueId;
			uniqueId++;
			//precalcoli
			if(offset==null) offset=0; //meglio comunque compreso tra -1/2 e 1/2
			var lunghezzaIniziale=Math.sqrt(Math.pow(Xb-Xa,2)+Math.pow(Yb-Ya,2));
			var angoloIniziale=Math.atan2(Yb-Ya,Xb-Xa);
			var posizioneIniziale=[(Xa+Xb)/2+lunghezzaIniziale*Math.cos(angoloIniziale)*offset/2,(Ya+Yb)/2+lunghezzaIniziale*Math.sin(angoloIniziale)*offset/2];
			var oggetto={
				id:identita,
				tipo:"linea",
				stileInterpolazioni:opzioniDisegno.stileInterpolazioni,
				colore:[opzioniDisegno.coloreTratto],
				spessore:[opzioniDisegno.spessoreTratto],
				capi:opzioniDisegno.capiLinea,
				posizione:[posizioneIniziale],
				offset:[offset],
				angolo:[angoloIniziale],
				lunghezza:[lunghezzaIniziale]
			}
			codaDisegno.push(oggetto);

			this.trasla=function(X,Y,tempo){
				var indice=oggetto.posizione.length;
				var valore=oggetto.posizione[indice-1];
				var aggiunta=[X,Y];
				oggetto.posizione=oggetto.posizione.concat(_libreriaD.intercalare(valore,aggiunta,tempo,oggetto.stileInterpolazioni));
			}
			this.ruota=function(misura,tempo){
				var indice=oggetto.angolo.length;
				var valore=oggetto.angolo[indice-1];
				oggetto.angolo=oggetto.angolo.concat(_libreriaD.intercalare(valore,misura,tempo,oggetto.stileInterpolazioni));
			}
			this.spostaCentro=function(misura,tempo){
				var indice=oggetto.offset.length;
				var valore=oggetto.offset[indice-1];
				oggetto.offset=oggetto.offset.concat(_libreriaD.intercalare(valore,misura,tempo,oggetto.stileInterpolazioni));
			}
			this.sfuma=function(aggiunta,tempo){
				var indice=oggetto.colore.length;
				var valore=oggetto.colore[indice-1];
				oggetto.colore=oggetto.colore.concat(_libreriaD.intercalare(valore,aggiunta,tempo,oggetto.stileInterpolazioni));
			}
			this.dimensiona=function(misura,tempo){
				var indice=oggetto.lunghezza.length;
				var valore=oggetto.lunghezza[indice-1];
				oggetto.lunghezza=oggetto.lunghezza.concat(_libreriaD.intercalare(valore,misura,tempo,oggetto.stileInterpolazioni));
			}
		}

		var disegnaLinea=function(oggetto){
			var posizione=oggetto.posizione[Math.min(timeStamp,oggetto.posizione.length-1)];
			var offset=oggetto.offset[Math.min(timeStamp,oggetto.offset.length-1)];
			var angolo=oggetto.angolo[Math.min(timeStamp,oggetto.angolo.length-1)];
			var lunghezza=oggetto.lunghezza[Math.min(timeStamp,oggetto.lunghezza.length-1)];
			var colore=oggetto.colore[Math.min(timeStamp,oggetto.colore.length-1)];
			var spessore=oggetto.spessore[Math.min(timeStamp,oggetto.spessore.length-1)];
			ctx.strokeStyle=RGBDaArray(colore);
			ctx.lineWidth=spessore;
			ctx.lineCap=oggetto.capi;
			ctx.beginPath();
			ctx.moveTo(posizione[0]-lunghezza*Math.cos(angolo)*(1+offset)/2,posizione[1]-lunghezza*Math.sin(angolo)*(1+offset)/2);
			ctx.lineTo(posizione[0]+lunghezza*Math.cos(angolo)*(1-offset)/2,posizione[1]+lunghezza*Math.sin(angolo)*(1-offset)/2)
			ctx.stroke();
		}

		_libreriaD.cerchio=function(Xc,Yc,raggio,stile){
			var identita=uniqueId;
			uniqueId++;
			//precalcoli
			var bordoIniziale;
			var riempimentoIniziale;
			if(stile==null||stile=="vuoto"){bordoIniziale=true;riempimentoIniziale=false;}
			else if(stile=="pieno"){bordoIniziale=false;riempimentoIniziale=true;}
			else if(stile=="tutto"){bordoIniziale=true;riempimentoIniziale=true;}
			var oggetto={
				id:identita,
				tipo:"cerchio",
				stileInterpolazioni:opzioniDisegno.stileInterpolazioni,
				coloreBordo:[opzioniDisegno.coloreTratto],
				spessore:[opzioniDisegno.spessoreTratto],
				bordo:bordoIniziale,
				coloreRiempimento:[opzioniDisegno.coloreRiempimento],
				riempimento:riempimentoIniziale,
				angolo:[0],
				posizione:[[Xc,Yc]],
				raggio:[raggio]
			}
			codaDisegno.push(oggetto);

			this.trasla=function(X,Y,tempo){
				var indice=oggetto.posizione.length;
				var valore=oggetto.posizione[indice-1];
				var aggiunta=[X,Y];
				oggetto.posizione=oggetto.posizione.concat(_libreriaD.intercalare(valore,aggiunta,tempo,oggetto.stileInterpolazioni));
			}
			this.sfuma=function(aggiunta,tempo,elemento){
				if(elemento==null||elemento=="tutto"){
					sfumaBordo(aggiunta,tempo);
					sfumaRiempimento(aggiunta,tempo);
				}else if(elemento=="bordo"){
					sfumaBordo(aggiunta,tempo);
				}else if(elemento=="riempimento"){
					sfumaRiempimento(aggiunta,tempo);
				}
			}
			var sfumaBordo=function(aggiunta,tempo){
				var indice=oggetto.coloreBordo.length;
				var valore=oggetto.coloreBordo[indice-1];
				oggetto.coloreBordo=oggetto.coloreBordo.concat(_libreriaD.intercalare(valore,aggiunta,tempo,oggetto.stileInterpolazioni));
			}
			var sfumaRiempimento=function(aggiunta,tempo){
				var indice=oggetto.coloreRiempimento.length;
				var valore=oggetto.coloreRiempimento[indice-1];
				oggetto.coloreRiempimento=oggetto.coloreRiempimento.concat(_libreriaD.intercalare(valore,aggiunta,tempo,oggetto.stileInterpolazioni));
			}
			this.dimensiona=function(misura,tempo){
				var indice=oggetto.raggio.length;
				var valore=oggetto.raggio[indice-1];
				oggetto.raggio=oggetto.raggio.concat(_libreriaD.intercalare(valore,misura,tempo,oggetto.stileInterpolazioni));
			}
		}

		var disegnaCerchio=function(oggetto){
			var posizione=oggetto.posizione[Math.min(timeStamp,oggetto.posizione.length-1)];
			var coloreBordo=oggetto.coloreBordo[Math.min(timeStamp,oggetto.coloreBordo.length-1)];
			var coloreRiempimento=oggetto.coloreRiempimento[Math.min(timeStamp,oggetto.coloreRiempimento.length-1)];
			var spessore=oggetto.spessore[Math.min(timeStamp,oggetto.spessore.length-1)];
			var raggio=oggetto.raggio[Math.min(timeStamp,oggetto.raggio.length-1)];
			ctx.strokeStyle=RGBDaArray(coloreBordo);
			ctx.fillStyle=RGBDaArray(coloreRiempimento);
			ctx.lineWidth=spessore;
			ctx.beginPath();
			ctx.arc(posizione[0],posizione[1],raggio,0,2*Math.PI);
			if(oggetto.riempimento){ctx.fill();}
			if(oggetto.bordo){ctx.stroke();}
		}

		//convertitore colori
		_libreriaD.parseColore=function(colore){
			var temp=[0,0,0];
			if(colore.substring(0,3)=="rgb") temp=arrayDaRGB(colore);
			else if(colore.substring(0,1)=="#") temp=arrayDaRGB(RGBDaHex(colore));
			else temp=arrayDaRGB(RGBDaHex(HexDaNome(colore)));
			return temp;
		}
		var HexDaNome=function(nome){
			return {
				"aliceblue": "#f0f8ff",
				"antiquewhite": "#faebd7",
				"aqua": "#00ffff",
				"aquamarine": "#7fffd4",
				"azure": "#f0ffff",
				"beige": "#f5f5dc",
				"bisque": "#ffe4c4",
				"black": "#000000",
				"blanchedalmond": "#ffebcd",
				"blue": "#0000ff",
				"blueviolet": "#8a2be2",
				"brown": "#a52a2a",
				"burlywood": "#deb887",
				"cadetblue": "#5f9ea0",
				"chartreuse": "#7fff00",
				"chocolate": "#d2691e",
				"coral": "#ff7f50",
				"cornflowerblue": "#6495ed",
				"cornsilk": "#fff8dc",
				"crimson": "#dc143c",
				"cyan": "#00ffff",
				"darkblue": "#00008b",
				"darkcyan": "#008b8b",
				"darkgoldenrod": "#b8860b",
				"darkgray": "#a9a9a9",
				"darkgreen": "#006400",
				"darkkhaki": "#bdb76b",
				"darkmagenta": "#8b008b",
				"darkolivegreen": "#556b2f",
				"darkorange": "#ff8c00",
				"darkorchid": "#9932cc",
				"darkred": "#8b0000",
				"darksalmon": "#e9967a",
				"darkseagreen": "#8fbc8f",
				"darkslateblue": "#483d8b",
				"darkslategray": "#2f4f4f",
				"darkturquoise": "#00ced1",
				"darkviolet": "#9400d3",
				"deeppink": "#ff1493",
				"deepskyblue": "#00bfff",
				"dimgray": "#696969",
				"dodgerblue": "#1e90ff",
				"firebrick": "#b22222",
				"floralwhite": "#fffaf0",
				"forestgreen": "#228b22",
				"fuchsia": "#ff00ff",
				"gainsboro": "#dcdcdc",
				"ghostwhite": "#f8f8ff",
				"gold": "#ffd700",
				"goldenrod": "#daa520",
				"gray": "#808080",
				"green": "#008000",
				"greenyellow": "#adff2f",
				"honeydew": "#f0fff0",
				"hotpink": "#ff69b4",
				"indianred ": "#cd5c5c",
				"indigo": "#4b0082",
				"ivory": "#fffff0",
				"khaki": "#f0e68c",
				"lavender": "#e6e6fa",
				"lavenderblush": "#fff0f5",
				"lawngreen": "#7cfc00",
				"lemonchiffon": "#fffacd",
				"lightblue": "#add8e6",
				"lightcoral": "#f08080",
				"lightcyan": "#e0ffff",
				"lightgoldenrodyellow": "#fafad2",
				"lightgrey": "#d3d3d3",
				"lightgreen": "#90ee90",
				"lightpink": "#ffb6c1",
				"lightsalmon": "#ffa07a",
				"lightseagreen": "#20b2aa",
				"lightskyblue": "#87cefa",
				"lightslategray": "#778899",
				"lightsteelblue": "#b0c4de",
				"lightyellow": "#ffffe0",
				"lime": "#00ff00",
				"limegreen": "#32cd32",
				"linen": "#faf0e6",
				"magenta": "#ff00ff",
				"maroon": "#800000",
				"mediumaquamarine": "#66cdaa",
				"mediumblue": "#0000cd",
				"mediumorchid": "#ba55d3",
				"mediumpurple": "#9370d8",
				"mediumseagreen": "#3cb371",
				"mediumslateblue": "#7b68ee",
				"mediumspringgreen": "#00fa9a",
				"mediumturquoise": "#48d1cc",
				"mediumvioletred": "#c71585",
				"midnightblue": "#191970",
				"mintcream": "#f5fffa",
				"mistyrose": "#ffe4e1",
				"moccasin": "#ffe4b5",
				"navajowhite": "#ffdead",
				"navy": "#000080",
				"oldlace": "#fdf5e6",
				"olive": "#808000",
				"olivedrab": "#6b8e23",
				"orange": "#ffa500",
				"orangered": "#ff4500",
				"orchid": "#da70d6",
				"palegoldenrod": "#eee8aa",
				"palegreen": "#98fb98",
				"paleturquoise": "#afeeee",
				"palevioletred": "#d87093",
				"papayawhip": "#ffefd5",
				"peachpuff": "#ffdab9",
				"peru": "#cd853f",
				"pink": "#ffc0cb",
				"plum": "#dda0dd",
				"powderblue": "#b0e0e6",
				"purple": "#800080",
				"red": "#ff0000",
				"rosybrown": "#bc8f8f",
				"royalblue": "#4169e1",
				"saddlebrown": "#8b4513",
				"salmon": "#fa8072",
				"sandybrown": "#f4a460",
				"seagreen": "#2e8b57",
				"seashell": "#fff5ee",
				"sienna": "#a0522d",
				"silver": "#c0c0c0",
				"skyblue": "#87ceeb",
				"slateblue": "#6a5acd",
				"slategray": "#708090",
				"snow": "#fffafa",
				"springgreen": "#00ff7f",
				"steelblue": "#4682b4",
				"tan": "#d2b48c",
				"teal": "#008080",
				"thistle": "#d8bfd8",
				"tomato": "#ff6347",
				"turquoise": "#40e0d0",
				"violet": "#ee82ee",
				"wheat": "#f5deb3",
				"white": "#ffffff",
				"whitesmoke": "#f5f5f5",
				"yellow": "#ffff00",
				"yellowgreen": "#9acd32"
			}[nome.toLowerCase()];
		}
		var RGBDaHex=function(colore) {
			if (colore[0] === "#") colore = colore.substr(1);
			var red = parseInt(colore.slice(0,2), 16),
					green = parseInt(colore.slice(2,4), 16),
					blue = parseInt(colore.slice(4,6), 16);
			return "rgb("+red+","+green+","+blue+")";
		}
		var arrayDaRGB=function(colore){
			var temp=colore.replace(/[^\d,]/g, '').split(',');
			var ret=[];
			temp.forEach(function(item){ret.push(parseInt(item));});
			return ret;
		}
		var RGBDaArray=function(colore){
			return "rgb("+colore[0]+","+colore[1]+","+colore[2]+")";
		}

    return _libreriaD;
  }

  //Salvo la variabile in window per renderla accessibile
  if(typeof(window.D) === 'undefined'){
    window.D = libreriaD();
  }
})(window); //eseguo la funzione su window al caricamento della libreria