/**
 * <title>JavaScript ClosePage Support</title>
 */
// Refer close.txt for general documentation.

if (document.all && !window.opera)
{
  document.write('<span class="symbol">r</span>');
}
else
{
  document.write("&nbsp;");
}