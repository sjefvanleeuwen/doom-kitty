class MagazineReveal extends HTMLElement {
  private observer: IntersectionObserver | null = null;

  connectedCallback(): void {
    const observerOptions: IntersectionObserverInit = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.classList.add('active');
          if (this.hasAttribute('once')) this.observer?.unobserve(this);
        }
      });
    }, observerOptions);

    this.observer.observe(this);
  }

  disconnectedCallback(): void {
    this.observer?.disconnect();
  }
}

class MagazineNav extends HTMLElement {
  private _handleScroll: (() => void) | null = null;

  connectedCallback(): void {
    this.innerHTML = `
      <a href="#/" class="logo">DOOM KITTY</a>
      
      <button class="nav-toggle" aria-label="Toggle navigation">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </button>

      <div class="nav-links"><a href="#/">Home</a><a href="#/music">Music</a><a href="#/about">About</a></div>
    `;

    const toggle = this.querySelector('.nav-toggle') as HTMLElement;
    const links = this.querySelector('.nav-links') as HTMLElement;

    toggle.addEventListener('click', () => {
      this.classList.toggle('nav-open');
      document.body.classList.toggle('no-scroll');
    });

    // Close menu when a link is clicked (important for SPA)
    links.addEventListener('click', (e: Event) => {
      if ((e.target as HTMLElement).tagName === 'A') {
        this.classList.remove('nav-open');
        document.body.classList.remove('no-scroll');
      }
    });

    const handleScroll = () => {
      // Check multiple scroll sources for maximum compatibility
      const scrollPos = window.pageYOffset || 
                        document.documentElement.scrollTop || 
                        document.body.scrollTop || 0;
      
      if (scrollPos > 20) {
        this.classList.add('scrolled');
      } else {
        this.classList.remove('scrolled');
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run immediately
    requestAnimationFrame(handleScroll);
    
    this._handleScroll = handleScroll;
  }

  disconnectedCallback(): void {
    if (this._handleScroll) {
      window.removeEventListener('scroll', this._handleScroll);
    }
  }
}

class MagazineChevron extends HTMLElement {
  connectedCallback(): void {
    const text = this.getAttribute('text') || 'Scroll';
    this.innerHTML = `
      <div class="chevron-container" style="display: flex; flex-direction: column; align-items: center; cursor: pointer;">
        <div class="bounce" style="line-height: 1; display: flex; justify-content: center;">
          <svg width="30" height="15" viewBox="0 0 40 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 5l15 10L35 5"/>
          </svg>
        </div>
        <span style="font-family: 'Orbitron'; font-size: 0.55rem; letter-spacing: 3px; text-transform: uppercase; margin-top: 5px; color: rgba(255,255,255,0.6);">${text}</span>
      </div>
    `;
    
    this.addEventListener('click', () => {
      const parentSection = this.closest('section') || this.closest('header');
      const nextSection = parentSection?.nextElementSibling as HTMLElement | null;
      if (nextSection) {
        // Calculate offset to account for fixed navigation height
        const nav = document.querySelector('m-nav') as HTMLElement | null;
        const navHeight = nav ? nav.offsetHeight : 0;
        const targetPosition = nextSection.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  }
}

class MagazineFooter extends HTMLElement {
  connectedCallback(): void {
    this.innerHTML = `
      <footer><div class="footer-grid"><div class="footer-col"><h4>DOOM KITTY</h4><p>Music & moving images.</p></div><div class="footer-col"><h4>Explore</h4><ul><li><a href="#/">Home</a></li><li><a href="#/music">Music</a></li><li><a href="#/about">About</a></li></ul></div></div><div class="copyright">&copy; 2026 DOOM KITTY</div></footer>
    `;
  }
}

customElements.define('m-reveal', MagazineReveal);
customElements.define('m-nav', MagazineNav);
customElements.define('m-chevron', MagazineChevron);
customElements.define('m-footer', MagazineFooter);
