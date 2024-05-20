String.prototype.replace=function(o,n){
	return this.split(o).join(n);
}

Array.prototype.includes = function(e) {
	return (this.indexOf(e) != -1);
}

var d=document;

function gTC(th,type){
	// light
	bgclr='4c5a67'
	tclr='cbcbcb'
	vclr='dddddd'
	lclr='dddddd'

	switch(th){
		case 1://dark
			bgclr='191919'
			tclr='aaaaaa'
			break
		case 2://purple
			bgclr='4a2766'
			lclr='aaaaaa'
			break
		case 3://blue
			bgclr='002244'
			break
	}

	switch(type){
		case 'bg':
			return bgclr
		case 't':
			return tclr
		case 'v':
			return vclr
		case 'l':
			return lclr
	}
}
function head(th,fs,bgm,lp,msg,nl){
	switch(fs){
		case 'small':
			fsn=7
			break
		case 'large':
			fsn=4
			break
		default:
			fs='medium'
			fsn=5
			break
	}

	bgclr=gTC(th,'bg')
	tclr=gTC(th,'t')
	vclr=gTC(th,'v')
	lclr=gTC(th,'l')

	if(msg){d.write('<title>'+msg+'</title>')}
	d.write('<body background=file://rom/Images/Themes/Pattern.gif text='+tclr+' bgcolor='+bgclr+' vlink='+vclr+' link='+lclr+' hspace=0 vspace=0 fontsize='+fs+'>')
	if(bgm){
		if(bgm.indexOf('.')<0){bgm += '.mid'}
		if(bgm.indexOf('/')<0){bgm = 'file://rom/Cache/Music/' + bgm}
		d.write('<bgsound src="'+bgm+'" autostart=true')
		if(!lp){d.write('>')}
		else{
			if(lp==-1){lp=9999;}
			d.write(' loop='+lp+'>')
		}
	}
	if(!msg){msg=""}
	d.write('<table cellspacing=0 cellpadding=0>')
	d.write('<tr><td>')
	tab();
	d.write('<spacer type=block width=11 height=11><br>')
	d.write('<spacer type=block width=10 height=1>')
	if(!nl){d.write('<a href="javascript:goHTV()">')}
	d.write('<img src=file://ROM/Cache/WebTVLogoJewel.gif width=90 height=69>')
	if(!nl){d.write('</a>')}
	tab(msg);
	d.write('</td></tr></table>')
}	

function tab(msg){
	msg=msg.replace(' ','&nbsp;')
	if(msg){d.write('<td width=100% height=80 valign=top background=file://ROM/Images/Themes/ShadowLogo.gif novtilebg><td abswidth=460 height=54 valign=top background=file://ROM/Images/Themes/ShadowLogo.gif align=right novtilebg><spacer height=32 type=block><b><shadow><blackface><font color=cbcbcb>'+msg+' &nbsp; </font></blackface></shadow></b>')}
	else{d.write('<td width=100% height=80 valign=top align=left background=file://ROM/Images/Themes/ShadowLogo.gif novtilebg>')}
}

function ci(th){
	bgclr=gTC(th,'bg')
	tclr=gTC(th,'t')
	d.write('&nbsp;&nbsp;<textarea rows=4 size=46 id=msg name=msg border=0 text='+tclr+' bgcolor='+bgclr+' value="" nohighlight noselect></textarea>')
}

function as(th,bg,h,w,g,b,lc,rc,lo,ro,s){
	
	if(s){
		if(!lc){lc=gTC(th,'t')}
		if(!rc){rc=gTC(th,'bg')}
	} else{
		if(!lc){lc=gTC(th,'bg')}
		if(!rc){rc=gTC(th,'t')}
	}
	if(th == 1){bgclr='333333'}
	if(!bg){bg='191919'}
	if(!h){h=32}
	if(!w){w=320}
	if(!g){g=0}
	if(!lo){lo=0}
	if(!ro){ro=0}
	if(!b){b=1}
	d.write('<audioscope bgcolor='+bg+' height='+h+' width='+w+' gain='+g+' leftcolor='+tclr+' rightcolor='+bgclr+' leftoffset='+lo+' rightoffset='+ro+' border='+b+'>')
}

function go(u){
	location.href=u
	return true
}

function goHTV(){return go('file://ROM/HTMLs/HackTV.html')}

function butt(th,v,n,w,t,x){
	tclr=gTC(th,'t')
	d.write('<font color='+tclr+'>')
	if(!t)t='submit';
	d.write('<input type='+t+' value="'+v+'"')
	if(n)d.write(' name='+n)
	if(w)d.write(' width='+w)
	if(x)d.write(' '+x)
	if(th > 0){d.write(' usestyle borderimage=file://ROM/Borders/ButtonBorderTh'+th+'.bif')}
	d.write('></font>');
}

function dial(){
	go('client:redialphone')
	go('client:logoshown')
}