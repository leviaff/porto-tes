// ==========================================
// 1. DEFINISI VARIABEL & SELECTOR UTAMA
// ==========================================
const navLinks = document.querySelectorAll('.ul-list li a');
const sections = document.querySelectorAll('section');
const revealElements = document.querySelectorAll('.home-container, .about-container, .projects-container, .services-container, .contact-content');

// Tambahkan class 'reveal' sebagai state awal animasi
revealElements.forEach(el => el.classList.add('reveal'));

// ==========================================
// 2. SETUP TOMBOL BACK TO TOP
// ==========================================
const backToTop = document.createElement('div');
backToTop.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
backToTop.id = "back-to-top";
document.body.appendChild(backToTop);

backToTop.style.cssText = `
  position: fixed;
  bottom: 40px;
  right: 40px;
  background: #474af0;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1000;
  transition: transform 0.3s ease;
`;

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

backToTop.addEventListener('mouseover', () => backToTop.style.transform = 'scale(1.2)');
backToTop.addEventListener('mouseout', () => backToTop.style.transform = 'scale(1)');

// ==========================================
// 3. FUNGSI UTAMA (UPDATE UI)
// ==========================================
// Fungsi ini menggabungkan logika Active Link, Scroll Reveal, dan BackToTop
// agar bisa dipanggil saat Scroll MAUPUN saat halaman baru selesai loading.
function updateUI() {
  let scrollPos = window.scrollY + 100;
  const windowHeight = window.innerHeight;

  // A. Logika Active Navigation Link
  function removeActive() {
    navLinks.forEach(link => link.parentElement.classList.remove('active'));
  }

  sections.forEach(section => {
    if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
      removeActive();
      const activeLink = document.querySelector(`.ul-list li a[href="#${section.id}"]`);
      if (activeLink) activeLink.parentElement.classList.add('active');
    }
  });

  // B. Logika Back to Top Visibility
  if(window.scrollY > 500){
    backToTop.style.display = "flex";
  } else {
    backToTop.style.display = "none";
  }

  // C. Logika Reveal Elements (Munculkan elemen)
  revealElements.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;
    const revealPoint = 150;

    // Cek apakah elemen ada dalam viewport
    if(elementTop < windowHeight - revealPoint){
      el.classList.add('active-reveal');
    }
  });
}

// Jalankan fungsi saat user melakukan scroll
window.addEventListener('scroll', updateUI);

// ==========================================
// 4. NAVIGASI KLIK (SMOOTH SCROLL)
// ==========================================
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);

    window.scrollTo({
      top: targetSection.offsetTop - 80, 
      behavior: 'smooth'
    });

    // Update manual class active saat klik
    navLinks.forEach(l => l.parentElement.classList.remove('active'));
    link.parentElement.classList.add('active');
  });
});

// ==========================================
// 5. EFEK KARTU (HOVER)
// ==========================================
const cards = document.querySelectorAll('.project-card, .c1, .service-card');
cards.forEach(card => {
  card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-8px) scale(1.05)');
  card.addEventListener('mouseleave', () => card.style.transform = 'translateY(0) scale(1)');
});

// ==========================================
// 6. TYPING EFFECT
// ==========================================
const typingElement = document.querySelector('.info-home h3'); 
const words = ["Frontend Developer", "UI/UX Designer", "Web Enthusiast", "React Developer"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function type() {
  // Cek jika typingElement ada agar tidak error di halaman lain
  if (!typingElement) return;

  const currentWord = words[wordIndex];
  let displayedText = currentWord.substring(0, charIndex);
  
  typingElement.innerHTML = displayedText + '<span class="cursor">|</span>';

  if (!isDeleting && charIndex < currentWord.length) {
    charIndex++;
    setTimeout(type, typingSpeed);
  } else if (isDeleting && charIndex > 0) {
    charIndex--;
    setTimeout(type, typingSpeed / 2);
  } else {
    isDeleting = !isDeleting;
    if (!isDeleting) {
      wordIndex = (wordIndex + 1) % words.length;
    }
    setTimeout(type, 1000);
  }
}

document.addEventListener('DOMContentLoaded', type);

// ==========================================
// 7. LOADING SCREEN
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const loadingText = document.getElementById("loading-text");
  const mainIcon = document.querySelector(".main-icon");
  const subIcons = document.querySelectorAll(".sub-icons i");
  const designerText = document.getElementById("designer-text");
  const mainPage = document.getElementById("main-page");
  const loadingScreen = document.getElementById("loading-screen");

  function showElement(element, delay=0){
    if(element) { // Cek null safety
      setTimeout(() => {
        element.classList.remove("hidden");
        element.classList.add("fall");
      }, delay);
    }
  }

  showElement(loadingText, 0);          
  showElement(mainIcon, 800);         
  if(subIcons) {
      subIcons.forEach((icon, idx) => {
        showElement(icon, 1600 + idx*400);  
      });
  }
  showElement(designerText, 2800);    

  // Sembunyikan loading screen dan tampilkan halaman utama
  setTimeout(() => {
    if(loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display='none';
            
            // --- KUNCI UTAMA ---
            // Panggil updateUI() di sini agar elemen Home langsung muncul
            // setelah loading screen hilang, tanpa perlu scroll.
            updateUI(); 
            
        }, 500);
    }
    
    if(mainPage) mainPage.classList.add("visible");
  }, 4000);
});
