import { useEffect, useRef, useState } from "react";
import axios from "axios";

function App() {
	const xyz = "ff84a25df0574384b7b141848231912";

	const [isDarkMode, setIsDarkMode] = useState(false);

	const [latitude, setLatitude] = useState(null);
	const [longitude, setLongitude] = useState(null);

	const [locationData, setLocationData] = useState({
		longitude: 0,
		latitude: 0,
	});

	console.log(latitude, longitude, locationData);

	const [locationName, setLocationName] = useState("");
	const [cityName, setCityName] = useState("");

	const [realTimeWeather, setRealTimeWeather] = useState([]);

	const [isLoaded, setIsLoaded] = useState(true);

	const [hour, setHour] = useState([]);
	const [toDayDate, setToDayDate] = useState([]);

	const [dateCom, setDateCom] = useState("");
	console.log(dateCom);

	const [celsius, setCelsius] = useState(true);

	const scrollRef = useRef(null);

	const getLocation = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					setLatitude(position.coords.latitude);
					setLongitude(position.coords.longitude);
					setLocationData({
						longitude: position.coords.longitude,
						latitude: position.coords.latitude,
					});
				},
				(error) => {
					console.error("Error getting geolocation:", error);
				}
			);
		} else {
			console.error("Geolocation is not supported by this browser.");
		}
	};

	useEffect(() => {
		if (isDarkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [isDarkMode]);

	const toggleDarkMode = () => {
		setIsDarkMode((prevMode) => !prevMode);
	};

	useEffect(() => {
		getLocation();
		const now = new Date();
		const hours = String(now.getHours()).padStart(2, "0");
		setHour(hours);

		function formatTodayDate() {
			const date = new Date();

			// Define arrays for suffixes and months
			const suffixes = ["st", "nd", "rd", "th"];
			const months = [
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September",
				"October",
				"November",
				"December",
			];

			// Extract day, month, and year
			const day = date.getDate();
			const month = months[date.getMonth()];
			const year = date.getFullYear();

			// Determine the suffix for the day (st, nd, rd, th)
			let daySuffix;
			if (day >= 11 && day <= 13) {
				daySuffix = "th";
			} else {
				daySuffix = suffixes[(day % 10) - 1] || "th";
			}

			// Construct the formatted date string
			const formattedDate = `${day}${daySuffix} ${month} ${year}`;

			return formattedDate;
		}

		// Usage example:
		const todayFormatted = formatTodayDate();
		setToDayDate(todayFormatted);

		// getLocationName();
		// currentWeather();
	}, []);

	useEffect(() => {
		const getLocationName = async () => {
			try {
				const response = await fetch(
					`https://nominatim.openstreetmap.org/reverse?format=json&lat=${locationData.latitude}&lon=${locationData.longitude}`
				);
				const data = await response.json();
				console.log(data);
				if (data.name) {
					setLocationName(data.name);
					setCityName(data.address.city);
				}
			} catch (error) {
				console.error("Error getting location name:", error);
			}
		};
		const delay = 1000;

		const timeout = setTimeout(() => {
			getLocationName();
		}, delay);

		return () => clearTimeout(timeout);
	}, [locationData, latitude, longitude]);

	const currentWeather = async () => {
		const options = {
			method: "GET",
			url: `https://api.weatherapi.com/v1/current.json?key=${xyz}&q=${locationName}&aqi=yes`,
			headers: { accept: "application/json" },
		};

		axios
			.request(options)
			.then(function (response) {
				console.log(response.data);
				setRealTimeWeather(response.data);
			})
			.catch(function (error) {
				console.error(error);
			});
	};

	const currentWeakWeather = async () => {
		const options = {
			method: "GET",
			url: `https://api.weatherapi.com/v1/forecast.json?key=${xyz}&q=Rangpur&days=6&aqi=yes&alerts=no`,
			headers: { accept: "application/json" },
		};

		axios
			.request(options)
			.then(function (response) {
				console.log(response.data);
				setRealTimeWeather(response.data);
				setIsLoaded(false);
			})
			.catch(function (error) {
				console.error(error);
			});
	};

	useEffect(() => {
		// getLocation();
		// getLocationName();
		currentWeakWeather();

		const dataDate = realTimeWeather.forecast?.forecastday[0].date;
		setDateCom(dataDate);
	}, [locationName]);

	// useEffect(() => {
	// 	// getLocation();
	// 	// getLocationName();
	// 	currentWeather();
	// }, [latitude, longitude]);

	useEffect(() => {
		if (scrollRef.current) {
			const currentHour = new Date().getHours();
			const currentHourElement = scrollRef.current.querySelector(
				`[data-hour="${currentHour}"]`
			);

			if (currentHourElement) {
				currentHourElement.scrollIntoView({
					behavior: "smooth",
					block: "nearest",
					inline: "start",
				});
			}
		}
	}, [realTimeWeather]);
	const DayName = ({ dateStr }) => {
		const givenDate = new Date(dateStr);
		const dateCom1 = givenDate.getUTCDate();
		console.log(dateCom1);
		const today = new Date();
		const dateCom2 = today.getUTCDate();
		console.log(dateCom2);

		const daysOfWeek = [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
		];
		const dayName = daysOfWeek[givenDate.getDay()];

		return (
			<span className="w-1/4">
				{dateCom1 == dateCom2 ? "Today" : <>{dayName}</>}
			</span>
		);
	};

	return (
		<div className="main text-gray-950 dark:text-slate-200 bg-gradient-to-br from-blue-50 to-gray-300 dark:bg-gradient-to-br dark:from-opacity-90 dark:from-black dark:to-gray-800 relative transition-all duration-500  dark:transition-all dark:duration-500">
			{isLoaded && (
				<>
					<svg
						class="pl"
						viewBox="0 0 200 200"
						width="200"
						height="200"
						xmlns="http://www.w3.org/2000/svg">
						<defs>
							<linearGradient id="pl-grad1" x1="1" y1="0.5" x2="0" y2="0.5">
								<stop offset="0%" stop-color="hsl(313,90%,55%)" />
								<stop offset="100%" stop-color="hsl(223,90%,55%)" />
							</linearGradient>
							<linearGradient id="pl-grad2" x1="0" y1="0" x2="0" y2="1">
								<stop offset="0%" stop-color="hsl(313,90%,55%)" />
								<stop offset="100%" stop-color="hsl(223,90%,55%)" />
							</linearGradient>
						</defs>
						<circle
							class="pl__ring"
							cx="100"
							cy="100"
							r="82"
							fill="none"
							stroke="url(#pl-grad1)"
							stroke-width="36"
							stroke-dasharray="0 257 1 257"
							stroke-dashoffset="0.01"
							stroke-linecap="round"
							transform="rotate(-90,100,100)"
						/>
						<line
							class="pl__ball"
							stroke="url(#pl-grad2)"
							x1="100"
							y1="18"
							x2="100.01"
							y2="182"
							stroke-width="36"
							stroke-dasharray="1 165"
							stroke-linecap="round"
						/>
					</svg>
				</>
			)}
			{!isLoaded && (
				<div>
					<button onClick={toggleDarkMode} className="absolute top-4 left-4 ">
						{isDarkMode ? (
							<span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24">
									<rect
										x="0"
										y="0"
										width="24"
										height="24"
										fill="rgba(255, 255, 255, 0)"
									/>
									<g
										fill="none"
										stroke="currentColor"
										strokeDasharray="2"
										strokeDashoffset="2"
										strokeLinecap="round"
										strokeWidth="2">
										<path d="M0 0">
											<animate
												fill="freeze"
												attributeName="d"
												begin="1.2s"
												dur="0.2s"
												values="M12 19v1M19 12h1M12 5v-1M5 12h-1;M12 21v1M21 12h1M12 3v-1M3 12h-1"
											/>
											<animate
												fill="freeze"
												attributeName="stroke-dashoffset"
												begin="1.2s"
												dur="0.2s"
												values="2;0"
											/>
										</path>
										<path d="M0 0">
											<animate
												fill="freeze"
												attributeName="d"
												begin="1.5s"
												dur="0.2s"
												values="M17 17l0.5 0.5M17 7l0.5 -0.5M7 7l-0.5 -0.5M7 17l-0.5 0.5;M18.5 18.5l0.5 0.5M18.5 5.5l0.5 -0.5M5.5 5.5l-0.5 -0.5M5.5 18.5l-0.5 0.5"
											/>
											<animate
												fill="freeze"
												attributeName="stroke-dashoffset"
												begin="1.5s"
												dur="1.2s"
												values="2;0"
											/>
										</path>
										<animateTransform
											attributeName="transform"
											dur="30s"
											repeatCount="indefinite"
											type="rotate"
											values="0 12 12;360 12 12"
										/>
									</g>
									<g fill="currentColor">
										<path d="M15.22 6.03L17.75 4.09L14.56 4L13.5 1L12.44 4L9.25 4.09L11.78 6.03L10.87 9.09L13.5 7.28L16.13 9.09L15.22 6.03Z">
											<animate
												fill="freeze"
												attributeName="fill-opacity"
												dur="0.4s"
												values="1;0"
											/>
										</path>
										<path d="M19.61 12.25L21.25 11L19.19 10.95L18.5 9L17.81 10.95L15.75 11L17.39 12.25L16.8 14.23L18.5 13.06L20.2 14.23L19.61 12.25Z">
											<animate
												fill="freeze"
												attributeName="fill-opacity"
												begin="0.2s"
												dur="0.4s"
												values="1;0"
											/>
										</path>
									</g>
									<g
										fill="currentColor"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2">
										<path d="M7 6 C7 12.08 11.92 17 18 17 C18.53 17 19.05 16.96 19.56 16.89 C17.95 19.36 15.17 21 12 21 C7.03 21 3 16.97 3 12 C3 8.83 4.64 6.05 7.11 4.44 C7.04 4.95 7 5.47 7 6 Z" />
										<set attributeName="opacity" begin="0.6s" to="0" />
									</g>
									<mask id="lineMdMoonFilledToSunnyFilledLoopTransition0">
										<circle cx="12" cy="12" r="12" fill="#fff" />
										<circle cx="18" cy="6" r="12" fill="#fff">
											<animate
												fill="freeze"
												attributeName="cx"
												begin="0.6s"
												dur="0.4s"
												values="18;22"
											/>
											<animate
												fill="freeze"
												attributeName="cy"
												begin="0.6s"
												dur="0.4s"
												values="6;2"
											/>
											<animate
												fill="freeze"
												attributeName="r"
												begin="0.6s"
												dur="0.4s"
												values="12;3"
											/>
										</circle>
										<circle cx="18" cy="6" r="10">
											<animate
												fill="freeze"
												attributeName="cx"
												begin="0.6s"
												dur="0.4s"
												values="18;22"
											/>
											<animate
												fill="freeze"
												attributeName="cy"
												begin="0.6s"
												dur="0.4s"
												values="6;2"
											/>
											<animate
												fill="freeze"
												attributeName="r"
												begin="0.6s"
												dur="0.4s"
												values="10;1"
											/>
										</circle>
									</mask>
									<circle
										cx="12"
										cy="12"
										r="10"
										fill="currentColor"
										mask="url(#lineMdMoonFilledToSunnyFilledLoopTransition0)"
										opacity="0">
										<set attributeName="opacity" begin="0.6s" to="1" />
										<animate
											fill="freeze"
											attributeName="r"
											begin="0.6s"
											dur="0.4s"
											values="10;6"
										/>
									</circle>
								</svg>
							</span>
						) : (
							<span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24">
									<g
										fill="none"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2">
										<g strokeDasharray="2">
											<path d="M12 21v1M21 12h1M12 3v-1M3 12h-1">
												<animate
													fill="freeze"
													attributeName="stroke-dashoffset"
													dur="0.2s"
													values="4;2"
												/>
											</path>
											<path d="M18.5 18.5l0.5 0.5M18.5 5.5l0.5 -0.5M5.5 5.5l-0.5 -0.5M5.5 18.5l-0.5 0.5">
												<animate
													fill="freeze"
													attributeName="stroke-dashoffset"
													begin="0.2s"
													dur="0.2s"
													values="4;2"
												/>
											</path>
										</g>
										<path
											fill="currentColor"
											d="M7 6 C7 12.08 11.92 17 18 17 C18.53 17 19.05 16.96 19.56 16.89 C17.95 19.36 15.17 21 12 21 C7.03 21 3 16.97 3 12 C3 8.83 4.64 6.05 7.11 4.44 C7.04 4.95 7 5.47 7 6 Z"
											opacity="0">
											<set attributeName="opacity" begin="0.5s" to="1" />
										</path>
									</g>
									<g fill="currentColor" fillOpacity="0">
										<path d="m15.22 6.03l2.53-1.94L14.56 4L13.5 1l-1.06 3l-3.19.09l2.53 1.94l-.91 3.06l2.63-1.81l2.63 1.81z">
											<animate
												id="lineMdSunnyFilledLoopToMoonFilledLoopTransition0"
												fill="freeze"
												attributeName="fill-opacity"
												begin="0.6s;lineMdSunnyFilledLoopToMoonFilledLoopTransition0.begin+6s"
												dur="0.4s"
												values="0;1"
											/>
											<animate
												fill="freeze"
												attributeName="fill-opacity"
												begin="lineMdSunnyFilledLoopToMoonFilledLoopTransition0.begin+2.2s"
												dur="0.4s"
												values="1;0"
											/>
										</path>
										<path d="M13.61 5.25L15.25 4l-2.06-.05L12.5 2l-.69 1.95L9.75 4l1.64 1.25l-.59 1.98l1.7-1.17l1.7 1.17z">
											<animate
												fill="freeze"
												attributeName="fill-opacity"
												begin="lineMdSunnyFilledLoopToMoonFilledLoopTransition0.begin+3s"
												dur="0.4s"
												values="0;1"
											/>
											<animate
												fill="freeze"
												attributeName="fill-opacity"
												begin="lineMdSunnyFilledLoopToMoonFilledLoopTransition0.begin+5.2s"
												dur="0.4s"
												values="1;0"
											/>
										</path>
										<path d="M19.61 12.25L21.25 11l-2.06-.05L18.5 9l-.69 1.95l-2.06.05l1.64 1.25l-.59 1.98l1.7-1.17l1.7 1.17z">
											<animate
												fill="freeze"
												attributeName="fill-opacity"
												begin="lineMdSunnyFilledLoopToMoonFilledLoopTransition0.begin+0.4s"
												dur="0.4s"
												values="0;1"
											/>
											<animate
												fill="freeze"
												attributeName="fill-opacity"
												begin="lineMdSunnyFilledLoopToMoonFilledLoopTransition0.begin+2.8s"
												dur="0.4s"
												values="1;0"
											/>
										</path>
										<path d="m20.828 9.731l1.876-1.439l-2.366-.067L19.552 6l-.786 2.225l-2.366.067l1.876 1.439L17.601 12l1.951-1.342L21.503 12z">
											<animate
												fill="freeze"
												attributeName="fill-opacity"
												begin="lineMdSunnyFilledLoopToMoonFilledLoopTransition0.begin+3.4s"
												dur="0.4s"
												values="0;1"
											/>
											<animate
												fill="freeze"
												attributeName="fill-opacity"
												begin="lineMdSunnyFilledLoopToMoonFilledLoopTransition0.begin+5.6s"
												dur="0.4s"
												values="1;0"
											/>
										</path>
									</g>
									<mask id="lineMdSunnyFilledLoopToMoonFilledLoopTransition1">
										<circle cx="12" cy="12" r="12" fill="#fff" />
										<circle cx="22" cy="2" r="3" fill="#fff">
											<animate
												fill="freeze"
												attributeName="cx"
												begin="0.1s"
												dur="0.4s"
												values="22;18"
											/>
											<animate
												fill="freeze"
												attributeName="cy"
												begin="0.1s"
												dur="0.4s"
												values="2;6"
											/>
											<animate
												fill="freeze"
												attributeName="r"
												begin="0.1s"
												dur="0.4s"
												values="3;12"
											/>
										</circle>
										<circle cx="22" cy="2" r="1">
											<animate
												fill="freeze"
												attributeName="cx"
												begin="0.1s"
												dur="0.4s"
												values="22;18"
											/>
											<animate
												fill="freeze"
												attributeName="cy"
												begin="0.1s"
												dur="0.4s"
												values="2;6"
											/>
											<animate
												fill="freeze"
												attributeName="r"
												begin="0.1s"
												dur="0.4s"
												values="1;10"
											/>
										</circle>
									</mask>
									<circle
										cx="12"
										cy="12"
										r="6"
										fill="currentColor"
										mask="url(#lineMdSunnyFilledLoopToMoonFilledLoopTransition1)">
										<set attributeName="opacity" begin="0.5s" to="0" />
										<animate
											fill="freeze"
											attributeName="r"
											begin="0.1s"
											dur="0.4s"
											values="6;10"
										/>
									</circle>
								</svg>
							</span>
						)}
					</button>
					<h1 className="text-center   text-3xl font-semibold py-4  ">
						Weather App
					</h1>
					<div className="py-4 ">
						<h4 className="text-center text-sm ">Explore Weather Forecasts</h4>
						<h3 className="flex justify-center items-center text-4xl pb-3 ">
							{/* <span className="pr-2">{locationName},</span>
					<span>{cityName}</span> */}
							{cityName ? (
								<span className="font-md relative after:absolute after:content-[''] after:w-full after:h-[3px] dark:after:bg-slate-200 after:bg-gray-950 after:rounded-full after:bottom-0 after:left-0 ">
									{cityName}
								</span>
							) : (
								<span>
									<span className="pr-2 text-lg">
										{locationName}
										{cityName ? "," : ""}
									</span>
									<span className=" text-lg ">{cityName}</span>
								</span>
							)}
						</h3>
						<div className="flex flex-col items-center">
							<span className="text-lg font-md">
								{realTimeWeather.current?.condition.text}
							</span>
							<img
								src={`https:${realTimeWeather.current?.condition.icon}`}
								alt=""
								className="w-20 object-cover "
							/>
							<div className="flex justify-between relative items-center w-full mb-8 ">
								<div className="w-1/4"></div>
								<div className="w-1/2 text-center text-5xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
									{celsius ? (
										<span className="before:content-[''] before:w-[10px] before:h-[10px] before:border-2 before:absolute before:rounded-full before:border-red-500 before:top-1 before:-right-2 relative inline-block after:absolute after:content-[''] after:text-[16px] after:bottom-1 after:-left-4  ">
											{realTimeWeather.current?.temp_c}
										</span>
									) : (
										<span className="before:content-[''] before:w-[10px] before:h-[10px] before:border-2 before:absolute before:rounded-full before:border-red-500 before:top-1 before:-right-2 relative inline-block after:absolute after:content-[''] after:text-[16px] after:bottom-1 after:-left-4  ">
											{realTimeWeather.current?.temp_f}
										</span>
									)}
								</div>
								<div className="w-[max-content] relative text-right rounded-full border border-gray-950 inline-block p-2 after:absolute after:content[''] after:h-full after:w-[2px] after:top-0 after:bg-gray-950 after:left-1/2 dark:after:bg-slate-200 ">
									<span
										className={` p-2 pr-3 ${celsius ? "" : ""}  `}
										onClick={() => setCelsius(true)}>
										C
									</span>
									<span
										className="p-2 pl-3  "
										onClick={() => setCelsius(false)}>
										F
									</span>
								</div>
							</div>
						</div>
						<div className="">
							<div className="flex justify-between items-center mb-3">
								<span>Today</span>
								<span>{toDayDate}</span>
							</div>
							<div
								className="rounded-lg px-3 py-2 mb-8 bg-gray-950 bg-opacity-15  text-gray-950 dark:bg-slate-200 dark:bg-opacity-15 dark:text-slate-200 "
								ref={scrollRef}>
								<div className="scroll-container snap-x flex items-center gap-8 overflow-x-scroll scrollbar-hidden">
									{realTimeWeather &&
										realTimeWeather.forecast?.forecastday[0].hour.map(
											(data, index) => {
												const time = new Date(data.time);
												const hour = time.getHours();

												const isPM = hour >= 12;
												const displayHour = hour % 12 || 12;
												const period = isPM ? "PM" : "AM";

												return (
													<div
														key={index}
														className={`flex flex-col snap-center  items-center justify-center w-12  rounded-full `}
														data-hour={hour}>
														<span
															className={`${
																hour === new Date().getHours()
																	? "underline"
																	: ""
															} `}>
															{displayHour}
															{period}
														</span>
														{/* <span> */}
														{/* {data.condition.icon} */}
														<img
															src={`https:${data.condition.icon}`}
															alt=""
															srcset=""
														/>
														{/* </span> */}
														<span
															// className="before:content-[''] before:w-2 before:h-2 before:border before:absolute before:rounded-full before:border-red-500 before:top-0 before:right-0 relative  "
															onClick={() => setCelsius(!celsius)}>
															{celsius ? (
																<span className="before:content-[''] before:w-[6px] before:h-[6px] before:border-2 before:absolute before:rounded-full before:border-red-500 before:top-1 before:-right-2 relative ">
																	{data.temp_c}
																</span>
															) : (
																<span className="before:content-[''] before:w-[6px] before:h-[6px] before:border-2 before:absolute before:rounded-full before:border-red-500 before:top-1 before:-right-2 relative ">
																	{data.temp_f}
																</span>
															)}
														</span>
													</div>
												);
											}
										)}
								</div>
							</div>
							<div>
								<span className="mb-3 block">7-Day Forecast</span>
								<div className=" bg-gray-950 bg-opacity-15  text-gray-950 dark:bg-slate-200 dark:bg-opacity-15 dark:text-slate-200  rounded-lg px-3 py-2">
									{realTimeWeather &&
										realTimeWeather.forecast?.forecastday.map((data, index) => {
											return (
												<div
													key={index}
													className="flex justify-between items-center px-3">
													<DayName dateStr={data.date} />
													<div className="w-1/2 flex justify-center">
														<img
															src={`https:${data.day.condition.icon}`}
															className=""
														/>
													</div>
													<span className="w-1/4 flex justify-center gap-4 ">
														{celsius ? (
															<>
																<span className="before:content-[''] before:w-[6px] before:h-[6px] before:border-2 before:absolute before:rounded-full before:border-red-500 before:top-1 before:-right-2 relative ">
																	{data.day.mintemp_c}
																</span>
																<span className="">/</span>
																<span className="before:content-[''] before:w-[6px] before:h-[6px] before:border-2 before:absolute before:rounded-full before:border-red-500 before:top-1 before:-right-2 relative ">
																	{data.day.maxtemp_c}
																</span>
															</>
														) : (
															<>
																<span className="before:content-[''] before:w-[6px] before:h-[6px] before:border-2 before:absolute before:rounded-full before:border-red-500 before:top-1 before:-right-2 relative ">
																	{data.day.mintemp_f}
																</span>
																<span>/</span>
																<span className="before:content-[''] before:w-[6px] before:h-[6px] before:border-2 before:absolute before:rounded-full before:border-red-500 before:top-1 before:-right-2 relative ">
																	{data.day.maxtemp_f}
																</span>
															</>
														)}
													</span>
												</div>
											);
										})}
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default App;








