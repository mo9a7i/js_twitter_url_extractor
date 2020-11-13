const { default: Axios } = require('axios');
const opn = require('opn');
const axios = require('axios').default;


async function start_http() {
	// Show it in browser
	console.log('before http server creation');
	const letters = 'a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z';
	const numbers = '1,2,3,4,5,6,7,8,9,0';
	const letters_array = letters.split(',');
	const uppercased_letters_array = letters_array.map(letter => letter.toUpperCase());
	const numbers_array = numbers.split(',');

	const combination = numbers_array.concat(uppercased_letters_array.concat(letters_array));
	const mega_nz_url = '%';


	combination.forEach(character =>{
		// console.log(mega_nz_url.replace('%', character));
		axios.post('https://eu.api.mega.co.nz/cs', [{ 'a':'g', 'g':1, 'ssl':0, 'p':mega_nz_url.replace('%', character) }])
			.then(response => {
				if(response.data != -9) {
					console.log(response.data + '   ' + response.config.data);
				}
			}).catch(error => {console.log(error);});
		// opn(mega_nz_url.replace('%', character));
	});


}

start_http();