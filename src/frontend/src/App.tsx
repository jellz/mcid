import { CheckIcon } from '@heroicons/react/solid';
import Demo from './Demo';

const whyPoints = [
	'Free & open source',
	'Easy to use',
	'Supports 1.8 to 1.16.5',
	'Minimal data collection',
];

const usageSteps = [
	<>
		On your frontend, instruct the user to connect to the Minecraft server{' '}
		<span className='font-semibold'>mcid.party</span> on 1.8-1.16.x
	</>,
	<>Accept the user received code to your backend (through a form)</>,
	<>
		Send a HTTP request to the endpoint below with the verification code, and
		you will receive information about the verified Minecraft account
	</>,
];

function App() {
	return (
		<div>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='max-w-4xl mx-auto'>
					<div>
						<img
							src='/logo.png'
							className='align-middle w-12 inline mx-0 my-4'
							alt='Logo - lock'
						/>
						<h1 className='text-4xl align-middle inline mx-2 my-4 font-semibold'>
							MCID
						</h1>
					</div>

					<div className='my-4'>
						MCID is a free-to-use service for developers to easily authenticate
						users with their Minecraft accounts. Potential use cases include{' '}
						<span className='italic'>Login with Minecraft</span> systems and
						linking Minecraft accounts to other identities.
					</div>
					<div className='my-4'>
						<h2 className='text-xl font-bold'>Why MCID?</h2>
						<ul>
							{whyPoints.map(p => (
								<li key={p}>
									<CheckIcon className='w-5 text-green-500 inline' /> {p}
								</li>
							))}
						</ul>
					</div>
					<div className='my-4'>
						<h2 className='text-xl font-bold'>How does it work?</h2>
						As a developer, you simply need to instruct users to connect to the
						Minecraft server <span className='font-semibold'>
							mcid.party
						</span>{' '}
						and consume the one-use code they receive (e.g. in a form). Then, on
						your backend, send a request to the endpoint detailed below with the
						verification code to receive information about the Minecraft
						account.
						<br />
						<br />
						All individual verification data is ephemeral. Verification codes,
						and their associated data, last for three minutes before they are
						marked for expiry. Once a verification code has been consumed, it is
						immediately deleted, leaving the system with no knowledge of
						previous players or clients.
					</div>
					<div className='my-4'>
						<h2 className='text-xl font-bold'>Usage</h2>
						<ol className='mb-4'>
							{usageSteps.map(s => (
								<li key={Math.random()} className='list-inside list-decimal'>
									{s}
								</li>
							))}
						</ol>
						<h3 className='text-lg font-semibold'>API</h3>
						<code className='text-lg'>
							POST https://mcid.party/api/verify/:code
						</code>
						<h3 className='text-lg'>Example</h3>
						<code className='text-lg'>
							POST https://mcid.party/api/verify/funny-bear
						</code>
						<br />
						<br />
						API responses are in JSON format. Try the demo below to see a
						response.
					</div>
					<div className='my-4'>
						<h2 className='text-xl font-bold'>Demo</h2>
						<Demo />
					</div>
					<footer className='bottom-10 my-10 w-full text-center'>
						<span className='text-gray-500 font-medium'>
							<a href='https://github.com/jellz/mcid'>Open-source on GitHub</a>{' '}
							&bull; <a href='https://github.com/jellz/mcid#license'>License</a>
						</span>
						<br />
						<span className='text-gray-400'>
							Copyright &copy;{' '}
							<a className='font-semibold' href='https://jlz.fun'>
								Daniel Gulic
							</a>{' '}
							2021
						</span>
					</footer>
				</div>
			</div>
		</div>
	);
}

export default App;
