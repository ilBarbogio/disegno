//libreria.js
//un test per creare una libreria di disegno

(function(window){

  //La libreria come funzione
  function libreriaD(){
    var _libreria = {};

		//*************************VARIABILI*******************
		//tecniche
		var canvasId="telaID";
		var canvas;
		var ctx;
		var canX,canY;

		//opzioni di disegno
		var coloreSfondo="#FFFFFF";
		var coloreTratto="#000000";
		var traccia=true;
		var coloreRiempimento="#000000";
		var riempi=false;
		var spessoreTratto=1;
		var capiLinee="round"; //bevel,round,miter
		var giuntiLinee="round"; //butt,round,square

		


		//*************************METODI*******************
		//da chiamare per primissima cosa
		_libreria.creaTela=function(larghezza, altezza, dove){
			var contenitore;
			canX=larghezza;
			canY=altezza;
			if(dove==null){contenitore=document.querySelector("body");}
			else{contenitore=document.getElementById(dove);}
			contenitore.innerHTML="<canvas id="+canvasId+" width=\""+canX+"px\" height=\""+canY+"px\"></canvas>";
			canvas=document.getElementById(canvasId);
			ctx=canvas.getContext("2d");
			//valori di default
			this.impostaOpzioniDisegno();

			//ctx.scale(1,-1);
			//ctx.translate(0,canY);
		};
		
		//OPZIONI DISEGNO
		//reimposta tutte le opzioni
		_libreria.impostaOpzioniDisegno=function(){
			ctx.strokeStyle= coloreTratto;
			ctx.lineWidth=spessoreTratto;
			ctx.fillStyle = coloreRiempimento;
			ctx.lineCap=capiLinee;
			ctx.lineJoin=giuntiLinee;
		}
		//stili
		_libreria.tratto=function(colore){
			if(colore!=null){
				coloreTratto=colore;
				this.impostaOpzioniDisegno();
				traccia=true;
			}else{
				traccia=false;
			}
		}
		_libreria.riempimento=function(colore){
			if(colore!=null){
				coloreRiempimento=colore;
				this.impostaOpzioniDisegno();
				riempi=true;
			}else{riempi=false;}
		}
		_libreria.spessore=function(spessore){
			if(spessore>0){
				spessoreTratto=spessore;
				this.impostaOpzioniDisegno();
				traccia=true;
			}else{
				traccia=false;
			}
		}
		_libreria.sfondo=function(colore){
			canvas.style.backgroundColor=colore;
		}
		_libreria.cancella=function(){
			ctx.clearRect(0,0,canX,canY);
		}

		//figure base
		_libreria.punto=function(X,Y){
			var fillTemp=coloreRiempimento;
			var riempiTemp=riempi;
			var tracciaTemp=traccia;
			riempi=true;
			traccia=false;
			spessore=spessoreTratto;
			if(spessore<0.5) spessore=0.5;
			this.riempimento(coloreTratto);
			this.cerchio(X,Y,spessore/2);
			this.riempimento(fillTemp);
			riempi=riempiTemp;
			traccia=tracciaTemp;
		}
		_libreria.linea=function(Xa,Ya,Xb,Yb){
			var tracciaTemp=traccia;
			ctx.beginPath();
			ctx.moveTo(Xa,Ya);
			ctx.lineTo(Xb,Yb);
			ctx.stroke();
			traccia=tracciaTemp;
		}
		_libreria.semiretta=function(Xa,Ya,Xb,Yb){
			var m=(Yb-Ya)/(Xb-Xa);
			var Xbordo=0,Ybordo=0;
			if(canX>canY){//intersezione con bordo verticale
				Xbordo=0;
				if(Xb>Xa) Xbordo=canX;
				Ybordo=m*(Xbordo-Xa)+Ya;
			}else{
				//intersezione con bordo orizzontale
				Ybordo=0;
				if(Yb>Ya) Ybordo=canY;
				Xbordo=(Ybordo-Ya+m*Xa)/m;
			}
			this.linea(Xa,Ya,Xbordo,Ybordo);
		}
		_libreria.retta=function(Xa,Ya,Xb,Yb){
			var m=(Yb-Ya)/(Xb-Xa);
			var X0,X1,Y0,Y1;
			if(canX>canY){//intersezione con bordo verticale
				X0=0; X1=canX;
				Y0=m*(X0-Xa)+Ya;
				Y1=m*(X1-Xa)+Ya;
			}else{
				//intersezione con bordo orizzontale
				Y0=0;Y1=canY;
				X0=(Y0-Ya+m*Xa)/m;
				X1=(Y1-Ya+m*Xa)/m;
			}
			this.linea(X0,Y0,X1,Y1);
		}
		_libreria.spezzata=function(args){
			if(arguments.length>0&&arguments.length%2!=0){console.log("Numero di argomenti sbagliato!");}
			else{
				ctx.beginPath();
				ctx.moveTo(arguments[0],arguments[1]);
				for(var i=2;i<arguments.length;i=i+2){
					ctx.lineTo(arguments[i],arguments[i+1]);
				}
				if(riempi) ctx.fill();
				if(traccia) ctx.stroke();
			}
		}
		_libreria.arco=function(Xa,Ya,Xb,Yb,Xc,Yc){//da fare
			
		}
		_libreria.cerchio=function(Xc,Yc,raggio){
			ctx.beginPath();
			ctx.arc(Xc,Yc,raggio,0,2*Math.PI);
			if(riempi) ctx.fill();
			if(traccia) ctx.stroke();
		}

    return _libreria;
  }

  //Salvo la variabile in window per renderla accessibile
  if(typeof(window.D) === 'undefined'){
    window.D = libreriaD();
  }
})(window); // We send the window variable withing our function


// Then we can call it using
//console.log(D);