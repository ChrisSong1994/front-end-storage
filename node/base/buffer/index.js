var mybuffer = new ArrayBuffer('==ii1j2i3h1i23h')
console.log(mybuffer)
require('fs').writeFile('logo.png', mybuffer)