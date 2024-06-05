function dF2(){dF(7);}//m minus number of non farts

function dF(m){
	if(!m){m=11}// 2 higher than last number
	r=Math.floor(Math.random() * m)
	if(r==0){u=cch+'Audio/fart1.mp3'}
	else if(r==1){u=cch+'Audio/fart2.mp3'}
	else if(r==2){u=cch+'Audio/fart3.mp3'}
	else if(r==3){u=cch+'Audio/fart4.mp3'}
	else if(r==4){u=cch+'Audio/fart5.mp3'}
	else if(r==5){u=cch+'Audio/fart6.mp3'}
	else if(r==6){u=cch+'Audio/fart7.mp3'}
	else if(r==7){
		u=cch+'Audio/engaged.mp3'
		setTimeout(dF2, 1600)
	}else if(r==8){
		u=cch+'Audio/asshole.mp3'
		setTimeout(dF2, 2000)
	}else if(r==9){
		u=cch+'Audio/better.mp3'
		setTimeout(dF2, 2800)
	}else{
		u=cch+'Audio/bum.mp3'
		setTimeout(dF2, 1500)
	}location.href=u
}
