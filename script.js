document.addEventListener('DOMContentLoaded', () => {

	/* ---------- Places (coordinates from OpenStreetMap) ---------- */
	const places = [
		{ name: 'Gateway of India',             area: 'Colaba',           lat: 18.9220, lng: 72.8346, img: 'Assets/web/gatewayofindia.jpg' },
		{ name: 'Marine Drive',                 area: 'Nariman Point',    lat: 18.9432, lng: 72.8235, img: 'Assets/web/pinksky.jpg' },
		{ name: 'Juhu Beach',                   area: 'Juhu',             lat: 19.1027, lng: 72.8247, img: 'Assets/web/juhu.jpg' },
		{ name: 'Elephanta Caves',              area: 'Elephanta Island', lat: 18.9630, lng: 72.9319, img: 'Assets/web/elephant-caves.jpg' },
		{ name: 'Chhatrapati Shivaji Terminus', area: 'Fort',             lat: 18.9399, lng: 72.8355, img: 'Assets/web/csmt-station.jpg' },
		{ name: 'Sanjay Gandhi National Park',  area: 'Borivali',         lat: 19.2178, lng: 72.9176, img: 'Assets/web/nationalpark.jpg' },
		{ name: 'Colaba Causeway',              area: 'Colaba · Shopping',      lat: 18.9208, lng: 72.8306, img: 'Assets/web/colaba-antiques.jpg' },
		{ name: 'Linking Road, Bandra',         area: 'Bandra West · Shopping', lat: 19.0617, lng: 72.8360, img: 'Assets/web/bandra-shoe-market.jpg' }
	];

	const mapsLink = (p) =>
		'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(p.name + ', Mumbai');


	/* ---------- Header: solid on scroll, mobile menu, active link ---------- */
	const header = document.getElementById('header');
	const navbar = document.getElementById('navbar');
	const menuBtn = document.getElementById('menu-btn');

	const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
	onScroll();
	window.addEventListener('scroll', onScroll, { passive: true });

	menuBtn.addEventListener('click', () => {
		const open = navbar.classList.toggle('open');
		menuBtn.setAttribute('aria-expanded', open);
		menuBtn.querySelector('i').className = open ? 'bx bx-x' : 'bx bx-menu';
	});

	navbar.querySelectorAll('a').forEach(link => {
		link.addEventListener('click', () => {
			navbar.classList.remove('open');
			menuBtn.setAttribute('aria-expanded', false);
			menuBtn.querySelector('i').className = 'bx bx-menu';
		});
	});

	const navLinks = [...navbar.querySelectorAll('a')];
	const sectionObserver = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (!entry.isIntersecting) return;
			navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
		});
	}, { rootMargin: '-45% 0px -50% 0px' });
	navLinks.forEach(a => {
		const section = document.querySelector(a.getAttribute('href'));
		if (section) sectionObserver.observe(section);
	});


	/* ---------- Scroll reveal (replaces the ScrollReveal library) ---------- */
	const revealObserver = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (!entry.isIntersecting) return;
			entry.target.classList.add('visible');
			revealObserver.unobserve(entry.target);
		});
	}, { threshold: 0.12 });

	document.querySelectorAll('.reveal').forEach(el => {
		// stagger cards that sit side by side
		const siblings = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
		el.style.transitionDelay = (siblings.indexOf(el) % 4) * 0.1 + 's';
		revealObserver.observe(el);
	});


	/* ---------- Live Mumbai time + weather in the hero ---------- */
	const timeEl = document.getElementById('mumbai-time');
	const updateTime = () => {
		timeEl.textContent = new Date().toLocaleTimeString('en-IN', {
			timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit', hour12: true
		}) + ' IST';
	};
	updateTime();
	setInterval(updateTime, 30000);

	const weatherText = (code) => {
		if (code === 0) return 'Clear';
		if (code <= 3) return 'Partly cloudy';
		if (code <= 48) return 'Hazy';
		if (code <= 67 || (code >= 80 && code <= 82)) return 'Rain';
		if (code >= 95) return 'Thunderstorm';
		return 'Cloudy';
	};

	fetch('https://api.open-meteo.com/v1/forecast?latitude=19.076&longitude=72.8777&current=temperature_2m,weather_code&timezone=Asia%2FKolkata')
		.then(res => res.json())
		.then(data => {
			const c = data.current;
			document.getElementById('mumbai-weather').textContent =
				Math.round(c.temperature_2m) + '°C ' + weatherText(c.weather_code);
		})
		.catch(() => { /* weather is a nice-to-have; ignore failures */ });


	/* ---------- Map ---------- */
	const list = document.getElementById('map-list');
	let map = null;
	const markers = [];

	places.forEach((p, i) => {
		const li = document.createElement('li');
		li.innerHTML = `
			<div><h4>${p.name}</h4><small>${p.area}</small></div>
			<a href="${mapsLink(p)}" target="_blank" rel="noopener" aria-label="Open ${p.name} in Google Maps" title="Open in Google Maps">
				<i class="bx bx-directions"></i>
			</a>`;
		li.addEventListener('click', (e) => {
			if (e.target.closest('a')) return;
			focusPlace(i);
		});
		list.appendChild(li);
	});

	if (window.L) {
		map = L.map('map', { scrollWheelZoom: false, zoomControl: true });

		// OpenStreetMap tiles (no API key needed); styles.css tints them to match the night theme
		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			maxZoom: 19
		}).addTo(map);

		places.forEach((p, i) => {
			const icon = L.divIcon({
				className: '',
				html: `<div class="pin"><span>${i + 1}</span></div>`,
				iconSize: [34, 34],
				iconAnchor: [17, 34],
				popupAnchor: [0, -34]
			});

			const marker = L.marker([p.lat, p.lng], { icon, title: p.name })
				.addTo(map)
				.bindPopup(`
					<div class="popup">
						<img src="${p.img}" alt="${p.name}">
						<div>
							<h4>${p.name}</h4>
							<p>${p.area} · ${p.lat.toFixed(4)}° N, ${p.lng.toFixed(4)}° E</p>
							<a href="${mapsLink(p)}" target="_blank" rel="noopener">Open in Google Maps →</a>
						</div>
					</div>`);

			marker.on('click', () => setActive(i));
			markers.push(marker);
		});

		map.fitBounds(L.latLngBounds(places.map(p => [p.lat, p.lng])), { padding: [40, 40] });

		// allow scroll-zoom only after the user clicks into the map
		map.on('click', () => map.scrollWheelZoom.enable());
		map.getContainer().addEventListener('mouseleave', () => map.scrollWheelZoom.disable());
	}

	function setActive(i) {
		[...list.children].forEach((li, j) => li.classList.toggle('active', i === j));
		markers.forEach((m, j) => {
			const pin = m.getElement() && m.getElement().querySelector('.pin');
			if (pin) pin.classList.toggle('active', i === j);
		});
	}

	function focusPlace(i) {
		setActive(i);
		if (!map) return;
		map.flyTo([places[i].lat, places[i].lng], 14, { duration: 1.2 });
		map.once('moveend', () => markers[i].openPopup());
	}

	// "Show on map" buttons on the place and shopping cards
	document.querySelectorAll('.btn-map').forEach(btn => {
		btn.addEventListener('click', () => {
			document.getElementById('Map').scrollIntoView({ behavior: 'smooth' });
			setTimeout(() => focusPlace(Number(btn.dataset.place)), 600);
		});
	});


	/* ---------- Forms (static site: show a friendly message instead of posting) ---------- */
	document.getElementById('trip-form').addEventListener('submit', (e) => {
		e.preventDefault();
		const form = e.target;
		const place = form.place.options[form.place.selectedIndex].text;
		document.getElementById('trip-msg').textContent =
			`Thanks, ${form.name.value.split(' ')[0]}! Your ${form.days.value}-day plan for ${place} is on its way.`;
		form.reset();
	});

	document.getElementById('news-form').addEventListener('submit', (e) => {
		e.preventDefault();
		document.getElementById('news-msg').textContent = 'You\'re subscribed. See you in the next issue!';
		e.target.reset();
	});
});
