var z_nv=null;

var z_th=new Array()
	z_th[0]='HackTV Light'
	z_th[1]='HackTV Dark'
	z_th[2]='zefie Purple'
	z_th[3]='SKCro Blue'

var z_bgm=new Array()
	z_bgm[0]='AliveAtDawn'
	z_bgm[1]='DarkDance'
	z_bgm[2]='Daybreak'
	z_bgm[3]='DialingWebTV'
	z_bgm[4]='DialingWebTV2'
	z_bgm[5]='DKC2LostWorld'
	z_bgm[6]='DKC3Pursuit'
	z_bgm[7]='europa'
	z_bgm[8]='FridayEvilArr'
	z_bgm[9]='Ghosttown'
	z_bgm[10]='Halloween'
	z_bgm[11]='house'
	z_bgm[12]='Intro017.mod'
	z_bgm[13]='Intro029.mod'
	z_bgm[14]='Intro101.mod'
	z_bgm[15]='karTV'
	z_bgm[16]='loop1'
	z_bgm[17]='loop2'
	z_bgm[18]='LowMansLyric'
	z_bgm[19]='luf1menu'
	z_bgm[20]='music15'
	z_bgm[21]='royal'
	z_bgm[22]='seqJ'
	z_bgm[23]='SimplyShort.mod'
	z_bgm[24]='SM64FileSel'
	z_bgm[25]='snowy1'
	z_bgm[26]='snowy2'
	z_bgm[27]='Starlight.xm'
	z_bgm[28]='TerranigmaRemix'
	z_bgm[29]='thriller'
	z_bgm[30]='world1'
	z_bgm[31]='zelda'

z_bgmdsk=[1,4,5,6,7,8,10,11,12,13,14,18,19,20,21,23,24,27,28,29,31]

var z_def=new Array()
	z_def[0]=0//theme
	z_def[1]=7//bgm

var chars="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.!"//64 possible different values

function gTN(th){return z_th[parseInt(th)]}

function gB(nv,off){
	b = nv.charAt(off)
	if(b){return chars.indexOf(b)}
	else{return -1}
}

function sB(nv,off,dat){
	prefix=''
	if(off>nv.length){for(i=0;i<off;i++){prefix += '?'}}
	else if(off > 0){prefix=nv.substring(0,off)}
	dat=chars.charAt(parseInt(dat));
	z_url='client:ConfirmBYOISPSetup?BYOISPProviderName='+prefix+dat+nv.substring(off+1)
	go(z_url)
}

function gV(nv,off){
	z_len=0
	switch(off){
		case 0:
			z_len=z_th.length
			break
		case 1:
			z_len=z_bgm.length
			break
	}
	z_val=gB(nv,off)
	if(z_val < 0 || z_val >= z_len){return parseInt(z_def[off])}
	return parseInt(z_val)
}

function gBGM(nv,n,rn) {
		o='file://rom/Cache/Music/'
		if(n){p=n}
		else{p=gV(nv,1)}
		
		if(rn){return p}
		f=z_bgm[p];
		if(f.indexOf('.') < 0){f+='.mid'}
		return o+f
}

function pp(){
	d.write('<form name=z><input type=hidden name=h value="&pname;"></form>')
	z_nv=d.z.h.value
	return parseInt(gV(z_nv,0))//theme
}