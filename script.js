document.addEventListener('DOMContentLoaded', () => {
	const sr = ScrollReveal({
		distance: '60px',
		duration: 700,
		delay: 100,
		reset: false
	});

	sr.reveal('.text', { delay: 200, origin: 'top' });
	sr.reveal('.heading', { delay: 800, origin: 'top' });
	sr.reveal('.service-container .box', { delay: 600, origin: 'top' });
	sr.reveal('.places-container .box', { delay: 800, origin: 'top' });
	sr.reveal('.about-container .about-img', { delay: 600, origin: 'left' });
	sr.reveal('.about-container .about-text', { delay: 800, origin: 'right' });
	sr.reveal('.reviews-container .box', { delay: 800, origin: 'top' });
	sr.reveal('.newsletter .box', { delay: 400, origin: 'bottom' });
});
