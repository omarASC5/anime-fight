const fs = require('fs');
const youtubedl = require('youtube-dl');
const yts = require('yt-search');

const opsToSearch = (anime, maxNumSongs, type) => {
	const opNames = [];
	if (type !== 'opening' && type !== 'closing') {
		throw new TypeError('Invalid type argument: (HINT) specify opening or closing [string]');
	}
	let count = 0;
	while (count < maxNumSongs) {
		opNames.push(`${anime} ${type} ${count + 1}`);
		count++;
	}
	return opNames;
};

const downloadAnimeSongsYT = (searchTerm, maxNumSongs, type) => {

	const punctuationless = searchTerm.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
	const finalString = punctuationless.replace(/\s{2,}/g," ");
	searchTerm = finalString;

	const path = `./${searchTerm}`;

	const opNames = opsToSearch(searchTerm, maxNumSongs, type);

	makeFolder(`./${searchTerm}`);

	preventDuplicates(opNames, maxNumSongs, path);

	for (let i = 0; i < opNames.length && i < maxNumSongs; i++) {
		yts(opNames[i], (err, r) => {
			if (err) throw err;
			
			const videoUrl = r.videos[0].url;

			const video = youtubedl(videoUrl, ['--format=140'], {cwd: path});
	
			const fileNum = parseInt(opNames[0].charAt(opNames[0].length - 1));

			video.on('info', (info) => {
				console.log('Download started');
				console.log(`Filename: ${info.title}`);
				console.log(`Size: ${info.size}`);

					if (info._duration_raw < 60 * 6) {
						if (info.title.includes((i + 1).toString())) {
							video.pipe(fs.createWriteStream(`${path}/${fileNum}_op.m4a`));
						} else {
							video.pipe(fs.createWriteStream(`${path}/${fileNum}_op.m4a`));
							maxNumSongs = 1;
						}
					}
			});
		});
	}
};

const makeFolder = (path) => {
	if (!fs.existsSync(path)) {
		fs.mkdirSync(path);
	}
};

const preventDuplicates = (opNames, maxNumSongs, path) => {
	const numOps = opNames.length;
	for (let i = 0; i < numOps && i < maxNumSongs; i++) {
		if (fs.existsSync(`${path}/${i + 1}_op.m4a`)) {
			//file exists, don't redownload it
			opNames.splice(opNames[i], 1);
		}
	}
};
 
const animeName = 'Time of Eve';
const maxNumSongs = 1;

downloadAnimeSongsYT(animeName, maxNumSongs, 'opening');
