import { CodeIcon, SparklesIcon } from '@heroicons/react/outline';
import {
	FormEvent,
	ChangeEvent,
	ClipboardEvent,
	useState,
	useEffect,
} from 'react';
import ErrorNotification from './ErrorNotification';

const defaultStore = {
	name: '...',
	uuid: '...',
	avatarUuid: '606e2ff0ed7748429d6ce1d3321c7838',
};

interface ResponseData {
	code?: string;
	created?: number;
	expiry?: number;
	uuid?: string;
	username?: string;
}

export default function Demo() {
	const [code, setCode] = useState<string>('');
	const [pasted, setPasted] = useState(false);
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<ResponseData>({});
	const [showErrorNotif, setShowErrorNotif] = useState(false);
	const [error, setError] = useState<string>('An error occurred');
	const [showJson, setShowJson] = useState(false);

	const handleSubmit = async (event?: FormEvent<HTMLFormElement>) => {
		if (event) event.preventDefault();
		if (!code || loading) return;
		console.log(code);
		setLoading(true);

		// await new Promise(r => setTimeout(r, 2000));

		const res = await fetch(
			(process.env.REACT_APP_API_BASE || '') + `/api/verify/${code}`,
			{
				method: 'post',
			}
		);

		if (!res.ok) {
			try {
				const json: { error: string } = await res.json();
				console.log(json.error);
				if (json.error) setError(json.error);
			} catch (err) {
				setError('An error occurred');
				console.error(err);
			}

			setData({});
			setCode('');
			setLoading(false);
			setShowErrorNotif(true);
			return setTimeout(() => setShowErrorNotif(false), 4000);
		}

		const json: ResponseData = await res.json();
		setData(json);
		setLoading(false);
	};

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		let { value } = event.target;
		if (value) value = value.toLowerCase().replace(/ /gi, '');
		setCode(value);
	};

	const handlePaste = (event: ClipboardEvent<HTMLInputElement>) =>
		setPasted(true);

	useEffect(() => {
		if (pasted) handleSubmit();
		setPasted(false);
	}, [code]);

	return (
		<div>
			<div className='max-w-7xl mx-auto my-2 '>
				<div className='bg-white h-64 rounded-lg shadow-xl overflow-hidden lg:grid lg:grid-cols-2'>
					<div className='pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-17'>
						<div className='lg:self-center'>
							<div className='max-w-3xl'>
								<h4 className='text-center mb-2'>
									Connect to <span className='font-semibold'>mcid.party</span>{' '}
									(1.8-1.16.x) and enter the code you receive{' '}
									<span className='text-sm italic'>
										(note: the code will only work once)
									</span>
								</h4>
								<form onSubmit={handleSubmit}>
									<label htmlFor='email' className='sr-only'>
										Verification code
									</label>
									<div className='grid grid-cols-3'>
										<input
											type='text'
											name='code'
											id='code'
											className='font-mono col-span-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
											placeholder='funny-bear'
											onChange={handleChange}
											value={code}
											onPaste={handlePaste}
										/>
										<button
											type='submit'
											className={`${
												loading
													? 'bg-indigo-400 cursor-not-allowed'
													: 'bg-indigo-600'
											} mx-2 w-full px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
										>
											{loading ? 'Verifying...' : 'Verify'}
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>
					<div className='relative pt-10 pb-12 px-4 sm:pt-16 sm:px-14 lg:py-16 lg:pr-0 xl:py-20 xl:px-10'>
						<div className='lg:self-center'>
							<div className='max-w-2xl'>
								{showJson && (
									<div className='h-10 -mt-4 -ml-4'>
										<code className='text-sm'>
											<pre>{JSON.stringify(data, null, 2)}</pre>
										</code>
									</div>
								)}
								{!showJson && (
									<div className='grid grid-cols-3'>
										<div className='col-span-1'>
											<img
												src={`https://crafatar.com/avatars/${
													data.uuid || defaultStore.avatarUuid
												}?overlay`}
												className='w-24 h-24 rounded-md'
											/>
										</div>
										<div className='col-span-2 text-center'>
											<span className='font-semibold'>
												{data.username || defaultStore.name}
											</span>
											<br />
											<span className='text-gray-400 font-mono text-sm'>
												{data.uuid || defaultStore.uuid}
											</span>
										</div>
									</div>
								)}
							</div>
						</div>
						<div className='absolute bottom-3 right-4'>
							{showJson ? (
								<SparklesIcon
									className='w-6 text-gray-400 cursor-pointer'
									onClick={() => setShowJson(false)}
								/>
							) : (
								<CodeIcon
									className='w-6 text-gray-400 cursor-pointer'
									onClick={() => setShowJson(true)}
								/>
							)}
						</div>
					</div>
				</div>
			</div>
			<ErrorNotification
				show={showErrorNotif}
				setShow={setShowErrorNotif}
				error={error}
			/>
		</div>
	);
}
