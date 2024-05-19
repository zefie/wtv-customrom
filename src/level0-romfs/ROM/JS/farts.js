function dF2(){dF(6);}//m minus number of non farts

function dF(m){
	if(!m){m=10}//2 higher than last number
	r=Math.floor(Math.random() * m)
	if(r==0){u="file://ROM/Cache/Audio/fart1.mp3"}
	else if(r==1){u="file://ROM/Cache/Audio/fart2.mp3"}
	else if(r==2){u="file://ROM/Cache/Audio/fart3.mp3"}
	else if(r==3){u="file://ROM/Cache/Audio/fart4.mp3"}
	else if(r==4){u="file://ROM/Cache/Audio/fart5.mp3"}
	else if(r==5){u="file://ROM/Cache/Audio/fart6.mp3"}
	else if(r==7){
		u="file://ROM/Cache/Audio/engaged.mp3"
		setTimeout(dF2, 1600)
	}else if(r==7){
		u="file://ROM/Cache/Audio/asshole.mp3"
		setTimeout(dF2, 2000)
	}else if(r==8){
		u="file://ROM/Cache/Audio/better.mp3"
		setTimeout(dF2, 2800)
	}else{
		u="file://ROM/Cache/Audio/bum.mp3"
		setTimeout(dF2, 1500)
	}location.href=u
}
