import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useWeb3Auth } from '../../contexts/Web3AuthContext';

export default function OnboardingModal() {
	const { signMessage, setLoggedIn, setIsLawyer } = useWeb3Auth();
	const router = useRouter();

	const [isOpen, setIsOpen] = useState(true);
	const [address, setAddress] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [firstName, setFirstName] = useState<string>('');
	const [lastName, setLastName] = useState<string>('');
	const [country, setCountry] = useState('');
	const [isLawyer, _setIsLawyer] = useState(false);
	const [profileImage, setProfileImage] = useState<string>('');
	const [isNewToBlockchain, setIsNewToBlockchain] = useState(true);
	const [agreeToTermsAndConditions, setAgreeToTermsAndConditions] =
		useState(false);
	const [specialization, setSpecialization] = useState('');
	const [regionUnderPractice, setRegionUnderPractice] = useState('');
	const [isSoloLawyer, setIsSoloLawyer] = useState(false);
	const [practiceType, setPracticeType] = useState(''); // better approach
	const [organizationId, setOrganizationId] = useState('');
	const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
	const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);

	useEffect(() => {
		if (
			typeof window !== 'undefined' &&
			typeof window.localStorage !== 'undefined'
		) {
			const userInfo = window.localStorage.getItem('userInfo');
			const _address = window.localStorage.getItem('address');
			if (_address) {
				setAddress(_address);
			}
			if (userInfo) {
				try {
					const userInfoJSON = JSON.parse(userInfo);
					const name = userInfoJSON.name;
					const { _firstName, _lastName } = splitName(name);
					setEmail(userInfoJSON.email);
					setFirstName(_firstName);
					setLastName(_lastName);

					setProfileImage(userInfoJSON.profileImage);
				} catch (error) {
					console.error('Error parsing userInfo from localStorage', error);
				}
			}
		}
	}, []);

	const resetFormState = () => {
		setEmail('');
		setCountry('');
		setLastName('');
		setFirstName('');
		setIsNewToBlockchain(true);
		setAgreeToTermsAndConditions(false);
	};

	const handleSignInAndSubmit = async (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		event.preventDefault();
		if (
			!firstName ||
			!lastName ||
			!email ||
			!country ||
			!agreeToTermsAndConditions
		) {
			return;
		}

		const payload = {
			firstName,
			lastName,
			email,
			country,
			isNewToBlockchain,
			agreeToTermsAndConditions,
			isLawyer,
			...(isLawyer && {
				specialization,
				regionUnderPractice,
				practiceType,
				organizationId
			}),
		};

		const signedMessage = await signMessage(JSON.stringify(payload));
		try {
			const serverResponse = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/onboardUser`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					address: address,
					payload: payload,
					signedMessage: signedMessage,
				}),
			});

			const data = await serverResponse.json();
			console.log('Server response data: ', data);

            const isLawyer = data.isLawyer;
            if (typeof window !== 'undefined') {
              if (isLawyer === true) {
                localStorage.setItem('isLawyer', isLawyer.toString());
                setLoggedIn(true)
                _setIsLawyer(true)
                setIsLawyer(true)
              }
              else localStorage.setItem('isLawyer', (!isLawyer).toString());
            }

			if (!data.onboarded) {
				throw Error('Could not store signed agreement and onboard user');
			}

			router.push(`/dashboard`);
		} catch (error) {
			console.log('Error: ', error);
			throw error;
		}
	};

	const splitName = (fullName: string) => {
		const nameParts = fullName.trim().split(' ');

		// // Handle cases with no spaces or only one name part
		// if (nameParts.length === 0) {
		// 	return { firstName: '', lastName: '' };
		// } else if (nameParts.length === 1) {
		// 	return { firstName: nameParts[0], lastName: '' };
		// }

		const firstName = nameParts.slice(0, -1).join(' ');
		const lastName = nameParts[nameParts.length - 1];

		return { _firstName: firstName, _lastName: lastName };
	};

	return (
		<>
			<div
				className={`hs-overlay-backdrop transition duration inset-0 bg-gray-900 bg-opacity-50 dark:bg-opacity-80 dark:bg-neutral-900 size-full fixed top-0 start-0 z-[100] overflow-x-hidden overflow-y-auto [--overlay-backdrop:static] ${
					isOpen ? 'open opened opacity-100' : 'hidden opacity-0'
				}`}
			>
				<div className="hs-overlay-open:mt-7 opacity-100 hs-overlay-open:duration-500 mt-0 ease-out transition-all lg:max-w-4xl lg:w-full m-3 lg:mx-auto min-h-[calc(100%-3.5rem)] flex items-center">
					<form className="w-full flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto dark:bg-slate-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
						<div className="p-4">
							<div className="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
								<h3 className="font-bold text-xl text-gray-800 dark:text-white">
									Welcome to IPSphere
								</h3>
							</div>

							<div className="my-4 grid grid-cols-2 gap-4">
								<div className="max-w space-y-3">
									<label
										htmlFor="user_firstname"
										className="block text-sm font-medium mb-2 dark:text-white"
									>
										First name
									</label>
									<input
										required
										type="text"
										id="user_firstname"
										value={firstName}
										disabled
										onChange={(event) => setFirstName(event.target.value)}
										className="py-3 px-4 block w-full border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500"
									/>
								</div>
								<div className="max-w space-y-3">
									<label
										htmlFor="user_lastname"
										className="block text-sm font-medium mb-2 dark:text-white"
									>
										Last Name*
									</label>
									<input
										required
										type="text"
										id="user_lastname"
										value={lastName}
										disabled
										onChange={(event) => setLastName(event.target.value)}
										className="py-3 px-4 block w-full border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500"
									/>
								</div>
							</div>
							<div className="my-4 grid grid-cols-2 gap-4">
								<div>
									<label
										htmlFor="user_email"
										className="block text-sm font-medium mb-2 dark:text-white"
									>
										Email
									</label>
									<input
										required
										type="email"
										id="user_email"
										value={email}
										disabled
										onChange={(event) => setEmail(event.target.value)}
										className="py-3 px-4 block w-full border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500"
										placeholder="username@provider.com"
									/>
								</div>

								<div className="hs-dropdown relative">
									<label
										htmlFor="user_country"
										className="block text-sm font-medium mb-2 dark:text-white"
									>
										Country
									</label>
									<button
										type="button"
										id="user_country"
										onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
										className="hs-dropdown-toggle py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:hover:bg-gray-700 dark:border dark:border-gray-700 dark:text-white"
									>
										{country || 'Select'}
										<svg
											className={`hs-dropdown-open:rotate-180 size-4 ${isCountryDropdownOpen ? 'rotate-180' : ''}`}
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path d="m6 9 6 6 6-6" />
										</svg>
									</button>

									<ul
										className={`hs-dropdown-menu transition-[opacity,margin] duration ${isCountryDropdownOpen ? 'opacity-100' : 'opacity-0 hidden'} min-w-60 bg-white shadow-md rounded-lg p-2 mt-2 dark:bg-gray-800 dark:border dark:border-gray-700 dark:text-white after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full`}
										aria-labelledby="hs-dropdown-hover-event"
									>
										<li onClick={() => { setCountry('United Kingdom'); setIsCountryDropdownOpen(false); }} className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300">
											United Kingdom
										</li>
										<li onClick={() => { setCountry('India'); setIsCountryDropdownOpen(false); }} className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300">
											India
										</li>
										<li onClick={() => { setCountry('United States of America'); setIsCountryDropdownOpen(false); }} className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300">
											United States of America
										</li>
										<li onClick={() => { setCountry('Thailand'); setIsCountryDropdownOpen(false); }} className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300">
											Thailand
										</li>
										<li onClick={() => { setCountry('Africa'); setIsCountryDropdownOpen(false); }} className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300">
											Africa
										</li>
										<li onClick={() => { setCountry('Germany'); setIsCountryDropdownOpen(false); }} className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300">
											Germany
										</li>
									</ul>
								</div>
							</div>
							<div className="max-w flex items-center gap-4">
								<span className="text-sm font-medium dark:text-white">
									Are you familiar with blockchain technology and products?
								</span>

								<div className="flex gap-x-6">
									<div className="flex">
										<input
											type="radio"
											name="hs-radio-group-1"
											id="hs-radio-group-1"
											onChange={(event) => setIsNewToBlockchain(false)}
											className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
										/>
										<label
											htmlFor="hs-radio-group-1"
											className="text-sm text-gray-500 ms-2 dark:text-neutral-400"
										>
											Yes
										</label>
									</div>

									<div className="flex">
										<input
											type="radio"
											name="hs-radio-group-1"
											id="hs-radio-group-2"
											onChange={(event) => setIsNewToBlockchain(true)}
											className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
										/>
										<label
											htmlFor="hs-radio-group-2"
											className="text-sm text-gray-500 ms-2 dark:text-neutral-400"
										>
											No
										</label>
									</div>
								</div>
							</div>

							<div className="max-w flex items-center gap-4">
								<span className="my-4 text-sm font-medium dark:text-white">
									Are you signing up as a lawyer?
								</span>

								<div className="flex gap-x-6">
									<div className="flex">
										<input
											type="radio"
											name="hs-radio-group"
											id="hs-radio-group-1"
											onChange={(event) => _setIsLawyer(true)}
											className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
										/>
										<label
											htmlFor="hs-radio-group-1"
											className="text-sm text-gray-500 ms-2 dark:text-neutral-400"
										>
											Yes
										</label>
									</div>

									<div className="flex">
										<input
											type="radio"
											name="hs-radio-group"
											id="hs-radio-group-2"
											onChange={(event) => _setIsLawyer(false)}
											className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
										/>
										<label
											htmlFor="hs-radio-group-2"
											className="text-sm text-gray-500 ms-2 dark:text-neutral-400"
										>
											No
										</label>
									</div>
								</div>
							</div>

							{isLawyer && (
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label
											htmlFor="specialization"
											className="block text-sm font-medium mb-2 dark:text-white"
										>
											Specialization
										</label>
										<div className="flex gap-4">
											<div className="flex items-center mb-4">
												<input
													type="radio"
													name="specialization"
													id="specialization_trademark"
													value="Trademark"
													checked={specialization === 'Trademark'}
													onChange={(event) => setSpecialization(event.target.value)}
													className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
												/>
												<label
													htmlFor="specialization_trademark"
													className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
												>
													Trademark
												</label>
											</div>
											<div className="flex items-center mb-4">
												<input
													type="radio"
													name="specialization"
													id="specialization_copyright"
													value="Copyright"
													checked={specialization === 'Copyright'}
													onChange={(event) => setSpecialization(event.target.value)}
													className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
												/>
												<label
													htmlFor="specialization_copyright"
													className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
												>
													Copyright
												</label>
											</div>
											<div className="flex items-center mb-4">
												<input
													type="radio"
													name="specialization"
													id="specialization_patent"
													value="Patent"
													checked={specialization === 'Patent'}
													onChange={(event) => setSpecialization(event.target.value)}
													className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
												/>
												<label
													htmlFor="specialization_patent"
													className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
												>
													Patent
												</label>
											</div>
											<div className="flex items-center mb-4">
												<input
													type="radio"
													name="specialization"
													id="specialization_design"
													value="Design"
													checked={specialization === 'Design'}
													onChange={(event) => setSpecialization(event.target.value)}
													className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
												/>
												<label
													htmlFor="specialization_design"
													className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
												>
													Design
												</label>
											</div>
										</div>
									</div>

									<div>
										<label
											htmlFor="soloOrganization"
											className="block text-sm font-medium mb-2 dark:text-white"
										>
											Solo/Organization
										</label>
										<div className="flex gap-4">
											<div className="flex items-center mb-4">
												<input
													type="radio"
													name="solo"
													checked={practiceType === 'Solo'} //
													onChange={(event) => setPracticeType('Solo')}
													className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
												/>
												<label
													htmlFor="solo"
													className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
												>
													Solo
												</label>
											</div>
											<div className="flex items-center mb-4">
												<input
													type="radio"
													name="organization"
													checked={practiceType === 'Organization'}
													onChange={(event) => setPracticeType('Organization')}
													className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
												/>
												<label
													htmlFor="organization"
													className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
												>
													Organization
												</label>
											</div>
										</div>
									</div>

									<div className="hs-dropdown relative">
										<label
											htmlFor="regionUnderPractice"
											className="block text-sm font-medium mb-2 dark:text-white"
										>
											Region Under Practice
										</label>
										<button
											type="button"
											id="regionUnderPractice"
											onClick={() => setIsRegionDropdownOpen(!isRegionDropdownOpen)}
											className="hs-dropdown-toggle py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:hover:bg-gray-700 dark:border dark:border-gray-700 dark:text-white"
										>
											{regionUnderPractice || 'Select'}
											<svg
												className={`hs-dropdown-open:rotate-180 size-4 ${isRegionDropdownOpen ? 'rotate-180' : ''}`}
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<path d="m6 9 6 6 6-6" />
											</svg>
										</button>

										<ul
											className={`hs-dropdown-menu transition-[opacity,margin] duration ${isRegionDropdownOpen ? 'opacity-100' : 'opacity-0 hidden'} min-w-60 bg-white shadow-md rounded-lg p-2 mt-2 dark:bg-gray-800 dark:border dark:border-gray-700 dark:text-white after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full`}
											aria-labelledby="hs-dropdown-hover-event"
										>
											<li onClick={() => { setRegionUnderPractice('United Kingdom'); setIsRegionDropdownOpen(false); }} className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300">
												United Kingdom
											</li>
											<li onClick={() => { setRegionUnderPractice('India'); setIsRegionDropdownOpen(false); }} className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300">
												India
											</li>
											<li onClick={() => { setRegionUnderPractice('United States of America'); setIsRegionDropdownOpen(false); }} className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300">
												United States of America
											</li>
											<li onClick={() => { setRegionUnderPractice('Thailand'); setIsRegionDropdownOpen(false); }} className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300">
												Thailand
											</li>
											<li onClick={() => { setRegionUnderPractice('Africa'); setIsRegionDropdownOpen(false); }} className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300">
												Africa
											</li>
											<li onClick={() => { setRegionUnderPractice('Germany'); setIsRegionDropdownOpen(false); }} className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300">
												Germany
											</li>
										</ul>
									</div>
									
									{practiceType === 'Organization' && (
										<div>
										<label
											htmlFor="organizationId"
											className="block text-sm font-medium mb-2 dark:text-white"
										>
											Organization ID
										</label>
										<input
											type="text"
											id="organizationId"
											value={organizationId}
											onChange={(event) => setOrganizationId(event.target.value)}
											className="py-3 px-4 block w-full border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500"
										/>
									</div>
									)}
								</div>
							)}

							<br/>

							<div className="flex">
								<input
									type="checkbox"
									id="hs-default-checkbox"
									checked={agreeToTermsAndConditions}
									onChange={(event) =>
										setAgreeToTermsAndConditions(event.target.checked)
									}
									className="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
								/>
								<label
									htmlFor="hs-default-checkbox"
									className="text-sm text-gray-500 ms-3 dark:text-neutral-400"
								>
									<span>I agree to the </span>
									<Link href="#" className="underline text-blue-500">
										terms & conditions
									</Link>
								</label>
							</div>
						</div>

						<div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t dark:border-neutral-700">
							<button
								type="submit"
								onClick={handleSignInAndSubmit}
								disabled={!agreeToTermsAndConditions}
								className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
							>
								Sign & Submit
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}
