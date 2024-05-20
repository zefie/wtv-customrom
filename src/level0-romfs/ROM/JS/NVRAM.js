var z_nv=null;

var z_th=new Array()
	z_th[0]='HackTV Light'
	z_th[1]='HackTV Dark'
	z_th[2]='zefie Purple'
	z_th[3]='SKCro Blue'

var z_bgm=new Array()
	z_bgm[0]='AliveAtDawn'
	z_bgm[1]='Daybreak'
	z_bgm[2]='Ghosttown'
	z_bgm[3]='karTV'
	z_bgm[4]='loop1'
	z_bgm[5]='loop2'
	z_bgm[6]='seqJ'
	z_bgm[7]='snowy1'
	z_bgm[8]='snowy2'
	z_bgm[9]='world1'

z_bgmdsk=[]

var z_def=new Array()
	z_def[0]=0//theme
	z_def[1]=5//bgm

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

function gBGM(nv,n) {
		o='file://rom/Cache/Music/'
		if(n){p=n}
		else{p=gV(nv,1)}
		
		if(z_bgmdsk.includes(p)){o='file://Disk/Browser/DiskFlash/Cache/Music/'}
		f=z_bgm[p];
		if(f.indexOf('.') < 0){f+='.mid'}
		return o+f
}

function gBGMNum(nv, n) {
	if(n){p=n}
	else{p=gV(nv,1)}
	return p
}


function pp(){
	d.write('<form name=z><input type=hidden name=h value="&pname;"></form>')
	z_nv=d.z.h.value
	return parseInt(gV(z_nv,0))//theme