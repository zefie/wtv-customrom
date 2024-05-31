z_nv=null;
z_th=new Array()
	z_th[0]='HackTV Light'
	z_th[1]='WebTV Dark'
	z_th[2]='Avegee Red'
	z_th[3]='Pumpkin Orange'
	z_th[4]='WinXP Tan'
	z_th[5]='Ryder Green'
	z_th[6]='SKCro Blue'
	z_th[7]='Win95 Teal'
	z_th[8]='zefie Purple'
	z_th[9]='MattMan Brown'
	z_th[10]='Paper White'
	z_th[11]='Halloween Black'

var z_bgm=new Array()
	z_bgm[0]='AliveAtDawn'
	z_bgm[1]='Ghosttown'
	z_bgm[2]='loop1'
	z_bgm[3]='loop2'
	z_bgm[4]='snowy1'
	z_bgm[5]='world1'
	
	z_bgm[6]='DarkDance'
	z_bgm[7]='Daybreak'
	z_bgm[8]='DialingWebTV'
	z_bgm[9]='DialingWebTV2'
	z_bgm[10]='DKC2LostWorld'
	z_bgm[11]='DKC3Pursuit'
	z_bgm[12]='europa'
	z_bgm[13]='FridayEvilArr'
	z_bgm[14]='Halloween'
	z_bgm[15]='house'
	z_bgm[16]='Intro017.mod'
	z_bgm[17]='Intro029.mod'
	z_bgm[18]='Intro101.mod'
	z_bgm[19]='karTV'
	z_bgm[20]='loop1'
	z_bgm[21]='loop2'
	z_bgm[22]='LowMansLyric'
	z_bgm[23]='luf1menu'
	z_bgm[24]='music15'
	z_bgm[25]='royal'
	z_bgm[26]='SimplyShort.mod'
	z_bgm[27]='SM64FileSel'
	z_bgm[28]='Starlight.xm'
	z_bgm[29]='stickerbrush'
	z_bgm[30]='TerranigmaRemix'
	z_bgm[31]='thriller'
	z_bgm[32]='zelda'

var z_def=new Array()
	z_def[0]=0//theme
	z_def[1]=12//bgm

chars="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@-"//64 possible different values
function gTN(th){return z_th[parseInt(th)]}
function gB(nv,off){
	b=nv.charAt(off)
	if(b){return chars.indexOf(b)}
	else{return -1}
}
function sB(nv,off,dat){
	prefix=''
	if(off > 0){prefix=nv.substring(0,off)}
	if(off>prefix.length){while(off!=prefix.length){prefix+='.'}}
	dat=chars.charAt(parseInt(dat));
	z_url='client:ConfirmBYOISPSetup?BYOISPProviderName='+prefix+dat+nv.substring(off+1)
	go(z_url)
}
function gV(nv,off){
	z_len=0
	switch(off){
		case 0:z_len=z_th.length
		break
		case 1:z_len=z_bgm.length
		break
	}
	z_val=gB(nv,off)
	if(z_val<0||z_val>=z_len){return parseInt(z_def[off])}
	return parseInt(z_val)
}
function gBGM(nv,n,rn){
		if(n){p=n}
		else{p=gV(nv,1)}
		if(rn){return p}
		f=z_bgm[p];
		if(f.indexOf('.')<0){f+='.mid'}
		return 'file://rom/Cache/Music/'+f
}
function pp(){
	d.write('<form name=z><input type=hidden name=h value=&pname;></form>')
	z_nv=d.z.h.value
	return parseInt(gV(z_nv,0))//theme
}
