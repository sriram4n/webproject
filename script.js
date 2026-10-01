const header = document.getElementById('header');

function updateHeader() {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', updateHeader);
updateHeader();

const places = {
    mumbai: [
        { name: 'Gateway of India', area: 'Colaba', img: 'Assets/GatewayofIndia.jpg', text: 'The iconic arch on the waterfront, overlooking Mumbai Harbour.' },
        { name: 'Marine Drive', area: 'Nariman Point', img: 'Assets/pinksky.jpg', text: "A seaside walk along the Queen's Necklace at sunset." },
        { name: 'Juhu Beach', area: 'Juhu', img: 'Assets/juhu.jpg', text: 'Sea breeze, colourful sunsets and famous street food.' },
        { name: 'Elephanta Caves', area: 'Elephanta Island', img: 'Assets/elephant caves.jpg', text: 'Ancient rock-cut temples on a short ferry ride away.' },
        { name: 'CSMT Station', area: 'Fort', img: 'Assets/csmt station.jpg', text: 'A grand Victorian Gothic railway landmark.' }
    ],
    nagpur: [
        { name: 'Deekshabhoomi', area: 'Nagpur', img: 'Assets/places/nagpur-deekshabhoomi.jpg', text: 'The great stupa where Dr. Ambedkar embraced Buddhism.' },
        { name: 'Futala Lake', area: 'Nagpur', img: 'Assets/places/nagpur-futala.jpg', text: 'A lively lakeside promenade with musical fountains.' },
        { name: 'Ambazari Lake', area: 'Nagpur', img: 'Assets/places/nagpur-ambazari.jpg', text: 'The largest lake in the city, with a garden beside it.' },
        { name: 'Sitabuldi Fort', area: 'Nagpur', img: 'Assets/places/nagpur-sitabuldi.jpg', text: 'A hill fort from the Anglo-Maratha battle of 1817.' },
        { name: 'Dragon Palace Temple', area: 'Kamptee', img: 'Assets/places/nagpur-dragon-palace.jpg', text: 'A peaceful Buddhist temple built with Japanese support.' }
    ],
    sambhajinagar: [
        { name: 'Ellora Caves', area: 'Ellora', img: 'Assets/places/sambhaji-ellora.jpg', text: 'UNESCO site with the giant rock-cut Kailasa temple.' },
        { name: 'Ajanta Caves', area: 'Ajanta', img: 'Assets/places/sambhaji-ajanta.jpg', text: 'Buddhist caves famous for their 2000-year-old paintings.' },
        { name: 'Bibi Ka Maqbara', area: 'Sambhajinagar', img: 'Assets/places/sambhaji-bibi.jpg', text: "Known as the 'Taj of the Deccan'." },
        { name: 'Daulatabad Fort', area: 'Daulatabad', img: 'Assets/places/sambhaji-daulatabad.jpg', text: 'A hilltop fortress with a maze of secret passages.' },
        { name: 'Grishneshwar Temple', area: 'Verul', img: 'Assets/places/sambhaji-grishneshwar.jpg', text: 'One of the twelve Jyotirlingas of Lord Shiva.' }
    ],
    nashik: [
        { name: 'Trimbakeshwar Temple', area: 'Trimbak', img: 'Assets/places/nashik-trimbakeshwar.jpg', text: 'A Jyotirlinga temple near the source of the Godavari.' },
        { name: 'Kalaram Temple', area: 'Panchavati', img: 'Assets/places/nashik-kalaram.jpg', text: 'A black-stone temple dedicated to Lord Rama.' },
        { name: 'Pandavleni Caves', area: 'Nashik', img: 'Assets/places/nashik-pandavleni.jpg', text: 'Over 20 Buddhist caves carved into a hillside.' },
        { name: 'Saptashrungi', area: 'Vani', img: 'Assets/places/nashik-saptashrungi.jpg', text: 'A hill shrine of the goddess, set among seven peaks.' },
        { name: 'Ramkund', area: 'Panchavati', img: 'Assets/places/nashik-ramkund.jpg', text: 'A holy bathing ghat on the Godavari, home of the Kumbh Mela.' }
    ]
};

function makeSlider(slider) {
    const track = slider.querySelector('.slider-track');
    const count = slider.querySelector('.slide-count');
    let current = 0;
    let timer = null;

    function show(index) {
        const total = track.children.length;

        current = (index + total) % total;

        track.style.transform = `translateX(-${current * 100}%)`;
        count.textContent = `${current + 1} / ${total}`;
    }

    function start() {
        stop();
        timer = setInterval(function () { show(current + 1); }, 5000);
    }

    function stop() {
        clearInterval(timer);
    }

    slider.querySelector('.next').addEventListener('click', function () { show(current + 1); start(); });
    slider.querySelector('.prev').addEventListener('click', function () { show(current - 1); start(); });

    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);

    show(0);
    start();

    return {
        restart: function () { show(0); start(); }
    };
}

const placesSlider = document.getElementById('placesSlider');
const placesTrack = placesSlider.querySelector('.slider-track');
const cityButtons = document.querySelectorAll('.city-btn');

function showCity(city) {
    placesTrack.innerHTML = '';

    places[city].forEach(function (place) {
        placesTrack.innerHTML += `
            <div class="slide">
                <img src="${place.img}" alt="${place.name}">
                <div class="slide-panel">
                    <h4>${place.area}</h4>
                    <h3>${place.name}</h3>
                    <p>${place.text}</p>
                </div>
            </div>`;
    });
}

showCity('mumbai');
const placesControl = makeSlider(placesSlider);

cityButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
        cityButtons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        showCity(btn.dataset.city);
        placesControl.restart();
    });
});

makeSlider(document.getElementById('aboutSlider'));
