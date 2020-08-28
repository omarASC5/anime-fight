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
	console.log(opNames)
	makeFolder(`./${searchTerm}`);

	preventDuplicates(opNames, maxNumSongs, path);
		

	function downloadSong(j, isOp, count) {
		const ytDLHelper = () => {
			console.log(opNames)
			yts(opNames[0], (err, r) => {
				if (err) throw err;
				
				const fileNum = parseInt(opNames[0].charAt(opNames[0].length - 1));
				let videoUrl = r.videos[j].url;
	
				let video = youtubedl(videoUrl, ['--format=140'], {cwd: path});
				video.on('info', (info) => {
					console.log('Download started');
					console.log(`Filename: ${info.title}`);
					console.log(`Size: ${info.size}`, info.tags);
					const animeOpTags = ['op', 'opening', 'OST', 'open', 'ending',
						'closing', 'ed', 'ost', 'OP', 'OPENING', 'ENDING', 'CLOSING',
						'ED'
					];
					animeOpTags.push(opNames[0]);
					animeOpTags.push(`${searchTerm} op ${fileNum}`);
					animeOpTags.push(`${searchTerm} ed ${fileNum}`);
	
					if (info.tags && info.tags.length !== 0) {
						for (let tag of info.tags) {
							if (animeOpTags.includes(tag)) {
								isOp = true;
								console.log('siiii', videoUrl, `${path}/${fileNum}_op.m4a`);
								break;
							}
						}
					}
					console.log('isOp', isOp === true);
					if (info.size === undefined || !isOp) {
						downloadSong(j + 1, isOp);
						console.log('hi', videoUrl);
					}
	
						if (info._duration_raw < 60 * 6) {
							if (info.title.includes((fileNum).toString())) {
								video.pipe(fs.createWriteStream(`${path}/${fileNum}_op.m4a`));
								opNames.shift();
								downloadSong(j, isOp, count + 1);
							} else {
								video.pipe(fs.createWriteStream(`${path}/${fileNum}_op.m4a`));
								maxNumSongs = 1;
								return;
							}
						}
				});
			});
		}
		if (count === maxNumSongs || opNames.length === 0) {
			return;
		}
		if (opNames.length === 1) {
			return ytDLHelper();
		}

		ytDLHelper();
	}

	downloadSong(0, false, 0);
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
	if (opNames[opNames.length - 2] === opNames[opNames.length - 1]) {
		opNames.pop();
	}
};
 
const animeName = 'Naruto';
const maxNumSongs = 6;

downloadAnimeSongsYT(animeName, maxNumSongs, 'opening');
