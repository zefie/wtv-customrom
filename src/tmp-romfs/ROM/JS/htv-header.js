String.prototype.replace=function(o,n){return this.split(o).join(n)}
d=document
rom='file://rom/'
function gTC(th,type){
	//light
	bgclr='4c5a67'
	bgimg='Pattern.gif'
	shimg='ShadowLogo.gif'
	bbif=''
	bclr='e7ce4a'
	tclr='cbcbcb'
	vclr='dddddd'
	lclr='dddddd'

	switch(th){
		case 1://dark
			bgclr='191919'
			tclr='42bd52'
			bbif='ButtonBorder2'
		break
		case 2://red
			bgclr='6e0005'
			tclr='f0f0f0'
			bclr='f0f0f0'
			bbif='Themes/ButtonBorder2'
		break
		case 3://orange
			bgclr='c06000'
			tclr='f0f0f0'
			bbif='Themes/ButtonBorder3'
		break
		case 4://tan
			bgclr='ece9d8'
			bgimg='xpbg.gif'
			tclr='000000'
			bbif='Themes/ButtonBorder4'
		break
		case 5://green
			bgclr='004422'
			tclr='f0f0f0'
			bbif='Themes/ButtonBorder5'
		break
		case 6://blue
			bgclr='002244'
			tclr='f0f0f0'
			bclr='000000'
			bbif='Themes/ButtonBorder6'
		break
		case 7://teal
			bgclr='008080'
			tclr='f0f0f0'
			bbif='Themes/ButtonBorder7'
		break
		case 8://purple
			bgclr='4a2766'
			lclr='aaaaaa'
			shimg='ShadowLogo8.gif'
			bbif='Themes/ButtonBorder8'
		break
		case 9://brown
			bgclr='442200'
			tclr='e7ce4a'
			bbif='Themes/ButtonBorder9'
		break
		case 10://white
			bgclr='c9c9c9'
			bgimg='Paper.jpg'
			tclr='020202'
			bbif='Themes/ButtonBorder10'
		case 11://halloween
			bgclr='080808'
			tclr='c06000'
			bbif='Themes/ButtonBorder11'
		break
	}
	switch(type){
		case 'bg':
			return bgclr
		case 'butt':
			return bbif
		case 'b':
			return bclr			
		case 'l':
			return lclr
		case 't':
			return tclr			
		case 'v':
			return vclr
	}
}
function head(th,msg,fs,bgm,lp,nl){
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
	d.write('<body background='+rom+'Images/Themes/'+bgimg+' text='+tclr+' bgcolor='+bgclr+' vlink='+vclr+' link='+lclr+' hspace=0 vspace=0 fontsize='+fs+'>')
	if(bgm){
		if(bgm.indexOf('.')<0){bgm+='.mid'}
		if(bgm.indexOf('/')<0){bgm=rom+'Cache/Music/'+bgm}
		d.write('<bgsound name=bgm src="'+bgm+'" autostart=true')
		if(!lp){d.write('>')}
		else{
			if(lp==-1){lp=9999}
			d.write(' loop='+lp+'>')
		}
	}
	if(!msg){msg=''}
	d.write('<table cellspacing=0 cellpadding=0>')
	d.write('<tr><td>')
	tab()
	d.write('<spacer type=block width=11 height=11><br>')
	d.write('<spacer type=block width=10 height=1><a href=javascript:goHTV()><img src='+rom+'Cache/WebTVLogoJewel.gif width=90 height=69></a>')
	tab(msg)
	d.write('</td></tr></table>')
}	

function tab(msg){
	msg=msg.replace(' ','&nbsp;')
	if(msg){d.write('<td width=100% height=80 valign=top background='+rom+'Images/Themes/'+shimg+' novtilebg><td abswidth=460 height=54 valign=top background='+rom+'Images/Themes/'+shimg+' align=right novtilebg><spacer height=32 type=block><b><shadow><blackface><font color=cbcbcb>'+msg+' &nbsp; </font></blackface></shadow></b>')}
	else{d.write('<td width=100% height=80 valign=top align=left background='+rom+'Images/Themes/'+shimg+' novtilebg>')}
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
	}else{
		if(!lc){lc=gTC(th,'bg')}
		if(!rc){rc=gTC(th,'t')}
	}
	if(th==1){bgclr='333333'}
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
function goHTV(){return go('client:gotoadvancedsetup')}

function butt(th,v,n,w,t,x){
	bclr=gTC(th,'b')
	bbif=gTC(th,'butt')
	if(th > 0){d.write('<shadow>')}
	d.write('<font color='+bclr+'>')
	if(!t)t='submit'
	d.write('<input type='+t+' value="'+v+'"')
	if(n)d.write(' name='+n)
	if(w)d.write(' width='+w)
	if(x)d.write(' '+x)
	if(bbif){d.write(' usestyle borderimage='+rom+'Borders/'+bbif+'.bif')}
	d.write('></font>')
	if(th>0){d.write('</shadow>')}
}

function dial(){
	go('client:redialphone')
	go('client:logoshown')
}