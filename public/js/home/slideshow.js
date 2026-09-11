const slideshow = document.querySelector('.slideshow');

if (slideshow) {
  const track = slideshow.querySelector('.slideshow-track');
  const slides = Array.from(slideshow.querySelectorAll('.slideshow-slide'));
  const prevButton = slideshow.querySelector('.slideshow-btn-prev');
  const nextButton = slideshow.querySelector('.slideshow-btn-next');
  const dotsContainer = slideshow.querySelector('.slideshow-dots');
  const delay = 5000;
  let currentIndex = 0;
  let timerId = null;

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'slideshow-dot';
    if (index === 0) {
      dot.classList.add('is-active');
    }
    dot.setAttribute('aria-label', `Ir a la imagen ${index + 1}`);
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = Array.from(dotsContainer.querySelectorAll('.slideshow-dot'));

  function slideWidth() {
    return slideshow.clientWidth;
  }

  function goToSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentIndex * slideWidth()}px)`;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === currentIndex);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === currentIndex);
    });

    startTimer();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function previousSlide() {
    goToSlide(currentIndex - 1);
  }

  function startTimer() {
    stopTimer();
    if (prefersReducedMotion || slides.length < 2) {
      return;
    }
    timerId = window.setInterval(nextSlide, delay);
  }

  function stopTimer() {
    if (timerId) {
      window.clearInterval(timerId);
      timerId = null;
    }
  }

  prevButton.addEventListener('click', previousSlide);
  nextButton.addEventListener('click', nextSlide);

  slideshow.addEventListener('mouseenter', stopTimer);
  slideshow.addEventListener('mouseleave', startTimer);

  window.addEventListener('resize', () => {
    track.style.transition = 'none';
    track.style.transform = `translateX(-${currentIndex * slideWidth()}px)`;
    track.offsetHeight;
    track.style.transition = '';
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopTimer();
    } else {
      startTimer();
    }
  });

  startTimer();
}
