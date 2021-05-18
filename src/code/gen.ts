import { adjectives, nouns } from './words';

// Generates random combination of adjective-noun-XY
export function generateCode() {
	return (
		adjectives[Math.floor(Math.random() * adjectives.length)] +
		'-' +
		nouns[Math.floor(Math.random() * nouns.length)]
		// + '-' +
		// Math.floor(Math.random() * 90 + 10)
	);
}
