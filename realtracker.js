// RealTracker script as created by http://11.rtcode.com/netpoll/ifreev3i.asp?id=161409&amp;to=0
// removed ads iframe and popup
document.write('<table border="0" cellspacing="0" cellpadding="0"><tr><td>');

function cv(s)
{
	var c, r, i, b, e;
	c = document.cookie;
	r = '';
	i = c.indexOf(s);
	if (i > -1)
  {
		b = c.indexOf('=', i) + 1;
		e = c.indexOf(';', i);
		if (e < 0)
    {
      e = c.length;
    }
		r = c.substring(b, e);
	}
	
  return r;
}

function wc(n,v,t)
{
	document.cookie = n + '=' + v + '; path=/; expires=' + t.toGMTString() + ';';
}

function td(n)
{
	var s = '' + n;
	return(s.length < 2 ? '0' + s : s);
}

function fdy(n)
{
	return (n < 100 ? '19' + n : '' + n);
}

var t, z, r, s, a, b, q, g, p, l;
t = new Date();
r = '&amp;tt=' + td(t.getMonth() + 1) + '%2F' + td(t.getDate()) + '%2F' + fdy(t.getYear()) + '+' 
+ td(t.getHours()) + '%3A' + td(t.getMinutes()) + '%3A' + td(t.getSeconds());
t.setTime(t.getTime() + 5184000000);
z = 'RTid';
b = parseInt(2000000000 * Math.random())
a = cv(z);
if (a == '') a = b;
wc(z, a, t);
q = screen;
r += '&amp;h=' + q.height +'&amp;w=' + q.width + '&amp;c=' + (q.pixelDepth ? q.pixelDepth : q.colorDepth)
r += '&amp;cl=' + escape(window.location.href) + '&amp;d=' + b + '&amp;b=' + a + '&amp;ck=' + (cv(z) != '' ? 1 : 0) + '&amp;j=' + (navigator.javaEnabled() ? 1 : 0)
g = document.referrer;
r += '&ref=' + escape(g);
s = '<a href="http://11.rtstats.com/netpoll/stat.asp?id=' + id
+ '&amp;to=" target="_blank"><img'
+ ' src="http://11.rtcode.com/netpoll/ifreev3.asp?id=' + id
+ '&amp;to=&amp;js=1' + r + '" border="0" width="88" height="32"'
+ '></' + 'a><br />';
document.write(s);
/*document.write('<IFRAME SRC="http://11.rtcode.com/netpoll/MHWAdLookup.asp?AdID=GNMde" WIDTH="88" HEIGHT="31" SCROLLING="no" FRAMEBORDER="0" FRAMESPACING="0" MARGINHEIGHT="0" MARGINWIDTH="0" BORDER="0" HSPACE="0" VSPACE="0"></IFRAME>\n');*/
document.write('</td></tr></table>');
