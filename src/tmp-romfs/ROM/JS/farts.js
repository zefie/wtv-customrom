function dF2(){dF(2);}//m minus number of non farts

function dF(m){
	if(!m){m=3}//2 higher than last number
	r=Math.floor(Math.random() * m)
	if(r==0){u="file://ROM/Cache/Audio/fart1.mp3"}
	else if(r==1){u="file://ROM/Cache/Audio/fart2.mp3"}
	else{
		u="file://ROM/Cache/Audio/engaged.mp3"
		setTimeout(dF2, 1600)
	}location.href=u
}
