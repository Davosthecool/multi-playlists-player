const { exec } = require('child_process');
const path = require('path');
const fs = require('fs-extra');

// Chemins des projets
const frontendPath = path.join(__dirname, 'frontend'); 
const backendPath = path.join(__dirname, 'backend'); 
const manifestPath = path.join(__dirname, 'manifest'); 
const buildPath = path.join(__dirname, 'build');

// Fonction pour exécuter une commande 
function runCommand(command, cwd) { 
	return new Promise((resolve, reject) => {
		exec(command, { cwd }, (error, stdout, stderr) => {
			if (error) { 
				console.error(`Erreur lors de l'exécution de la commande "${command}" dans le répertoire "${cwd}":`);
				console.error(`STDERR : ${stderr || "Aucune sortie d'erreur."}`);
				console.error(`STDOUT : ${stdout || "Aucune sortie standard."}`);
				return reject(new Error(`Commande "${command}" échouée avec le code ${error.code}`));
			} 
			if (stdout) console.log(`STDOUT : ${stdout}`);
			if (stderr) console.warn(`STDERR : ${stderr}`);
			resolve(); 
		}); 
	}); 
}

// Fonction principale pour orchestrer le build 
async function buildAll() {
	try { 
		console.log('Nettoyage du dossier build...'); 
		await fs.remove(buildPath);
		console.log('Build du frontend...');
		await runCommand('npm run build', frontendPath);
	
		console.log('Build du backend...');
		await runCommand('npm run build', backendPath);
	
		console.log('Copie des fichiers...');
		await fs.copy(path.join(frontendPath, 'dist'), buildPath);
		await fs.copy(path.join(backendPath, 'dist'), buildPath);
		await fs.copy(manifestPath, buildPath);
	
		console.log('Build terminé ! Les fichiers sont dans le dossier "build".');
	} catch (error) {
		console.error('Erreur pendant le build :', error);
	}
}

buildAll();