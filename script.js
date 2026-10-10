/**
 * Central Portfolio Application Logic (Nichol Theme Edition)
 * Author: Mr.Sanchat Ampansap (Run)
 * Powered by data.js
 */

document.addEventListener('DOMContentLoaded', () => {
  // Ensure data exists
  const data = window.PORTFOLIO_DATA;
  if (!data) {
    console.error('Portfolio data not found in window.PORTFOLIO_DATA');
    return;
  }

  /* --------------------------------------------------------------------------
     1. State Initialization
     -------------------------------------------------------------------------- */
  let currentLang = localStorage.getItem('portfolio_lang') || 'th';
  let currentTheme = localStorage.getItem('portfolio_theme') || 'light';
  let currentSkillCategory = 'all';
  let currentProjectCategory = 'all';

  // Apply initial theme & language
  document.documentElement.setAttribute('data-theme', currentTheme);
  document.documentElement.setAttribute('lang', currentLang);

  /* --------------------------------------------------------------------------
     2. DOM Element Selectors
     -------------------------------------------------------------------------- */
  const langToggleBtn = document.getElementById('lang-toggle-btn');
  const langLabel = document.getElementById('lang-label');
  const langFlag = document.getElementById('lang-flag');
  const themeToggleBtn = document.getElementById('theme-toggle-btn');

  // Mobile menu elements
  const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
  const mobileSidebar = document.getElementById('mobile-drawer') || document.getElementById('mobile-sidebar');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const sidebarCloseBtn = document.getElementById('drawer-close-btn') || document.getElementById('sidebar-close-btn');
  const sidebarLinks = document.querySelectorAll('.drawer-link-item, .sidebar-item');

  // Navigation
  const navbar = document.getElementById('navbar');
  const navItems = document.querySelectorAll('.nav-item');

  // Hero elements
  const heroGreetingBadge = document.getElementById('hero-greeting-badge');
  const heroDescText = document.getElementById('hero-desc-text');
  const typewriterElement = document.getElementById('typewriter-text');
  const heroTitleStatic = document.getElementById('hero-title-static');
  const portraitWatermark = document.getElementById('portrait-watermark');
  const floatStatusText = document.getElementById('float-status-text');

  // Stats
  const statLbl1 = document.getElementById('stat-lbl-1');
  const statLbl2 = document.getElementById('stat-lbl-2');
  const statLbl3 = document.getElementById('stat-lbl-3');

  // About Me elements
  const aboutBadgeText = document.getElementById('about-badge-text');
  const aboutHeadingText = document.getElementById('about-heading-text');
  const aboutDescText = document.getElementById('about-desc-text');
  const aboutValName = document.getElementById('about-val-name');
  const aboutValRole = document.getElementById('about-val-role');
  const aboutValLocation = document.getElementById('about-val-location');
  const aboutValStatus = document.getElementById('about-val-status');
  const lblFullname = document.getElementById('lbl-fullname');
  const lblRole = document.getElementById('lbl-role');
  const lblLocation = document.getElementById('lbl-location');
  const lblStatus = document.getElementById('lbl-status');

  // Sections Containers
  const skillsGrid = document.getElementById('skills-grid');
  const skillFilterTabs = document.getElementById('skill-filter-tabs');

  const projectsGrid = document.getElementById('projects-grid');
  const projectFilterTabs = document.getElementById('project-filter-tabs');

  const experienceTimeline = document.getElementById('experience-timeline');

  // Contact elements
  const contactEmailVal = document.getElementById('contact-email-val');
  const contactLineVal = document.getElementById('contact-line-val');
  const contactLocationVal = document.getElementById('contact-location-val');
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const contactForm = document.getElementById('contact-form');
  const contactPanelSub = document.getElementById('contact-panel-sub');
  const contactPanelNote = document.getElementById('contact-panel-note');

  // Toast & Scroll Top
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  /* --------------------------------------------------------------------------
     3. Typewriter Effect
     -------------------------------------------------------------------------- */
  let typewriterTimeout = null;
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function runTypewriter() {
    if (!typewriterElement) return;

    const phrases = data.typewriter[currentLang] || data.typewriter.en || [];
    if (!phrases.length) return;

    if (wordIndex >= phrases.length) {
      wordIndex = 0;
    }

    const currentPhrase = phrases[wordIndex];

    if (isDeleting) {
      typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 30 : 65;

    if (!isDeleting && charIndex === currentPhrase.length) {
      typeSpeed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % phrases.length;
      typeSpeed = 400;
    }

    typewriterTimeout = setTimeout(runTypewriter, typeSpeed);
  }

  function resetTypewriter() {
    if (typewriterTimeout) clearTimeout(typewriterTimeout);
    wordIndex = 0;
    charIndex = 0;
    isDeleting = false;
    runTypewriter();
  }

  /* --------------------------------------------------------------------------
     4. Render UI Components
     -------------------------------------------------------------------------- */
  function updateStaticTranslations() {
    const t = data.translations[currentLang] || data.translations.en;
    const p = data.profile;

    // Translate all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (t[key]) {
        if (key === 'hero_desc') {
          el.innerHTML = t[key];
        } else {
          el.textContent = t[key];
        }
      }
    });

    // Form placeholders
    const formNameInput = document.getElementById('form-name');
    const formEmailInput = document.getElementById('form-email');
    const formSubjectInput = document.getElementById('form-subject');
    const formMsgInput = document.getElementById('form-message');

    if (formNameInput && t.form_name_placeholder) {
      formNameInput.placeholder = t.form_name_placeholder;
    }
    if (formEmailInput) {
      formEmailInput.placeholder = 'name@example.com';
    }
    if (formSubjectInput && t.form_subject_placeholder) {
      formSubjectInput.placeholder = t.form_subject_placeholder;
    }
    if (formMsgInput && t.form_msg_placeholder) {
      formMsgInput.placeholder = t.form_msg_placeholder;
    }

    // Projects title fallback
    const projectsTitle = document.getElementById('projects-section-title');
    if (projectsTitle) {
      projectsTitle.textContent = t.projects_title || (currentLang === 'th' ? 'ผลงานเด่นที่คัดสรร' : 'Featured Projects');
    }

    // Language toggle badge & flag
    if (langLabel) langLabel.textContent = currentLang.toUpperCase();
    if (langFlag) langFlag.textContent = currentLang === 'th' ? '🇹🇭' : '🇺🇸';

    // Hero Badge & Static Title
    if (heroGreetingBadge) {
      heroGreetingBadge.textContent = currentLang === 'th'
        ? `สวัสดีครับ! ผมชื่อ ${p.name.th} (${p.nickname.th})`
        : `Hi! I'm ${p.name.en} (${p.nickname.en})`;
    }

    if (heroTitleStatic) {
      heroTitleStatic.textContent = currentLang === 'th' ? 'เชี่ยวชาญ:' : 'Specialized in:';
    }

    if (portraitWatermark) {
      portraitWatermark.textContent = (p.nickname.en || 'SANCHAT').toUpperCase();
    }

    if (floatStatusText) {
      floatStatusText.textContent = currentLang === 'th' ? 'พร้อมรับงานทันที' : 'Available for Work';
    }

    // Stats Labels
    if (statLbl1) statLbl1.textContent = currentLang === 'th' ? 'ปี ประสบการณ์' : 'Years Experience';
    if (statLbl2) statLbl2.textContent = currentLang === 'th' ? 'ผลงานโปรเจกต์' : 'Projects Done';
    if (statLbl3) statLbl3.textContent = currentLang === 'th' ? 'ความพึงพอใจลูกค้า' : 'Client Satisfaction';

    // About Me Section
    if (aboutBadgeText) aboutBadgeText.textContent = currentLang === 'th' ? 'เกี่ยวกับผม' : 'About Me';
    if (aboutHeadingText) aboutHeadingText.textContent = currentLang === 'th' ? 'ข้อมูลและประวัติโดยย่อ' : 'Personal Biography & Overview';
    if (aboutDescText) aboutDescText.textContent = p.description[currentLang] || p.description.en;

    const navAbout = document.getElementById('nav-about-text');
    if (navAbout) navAbout.textContent = currentLang === 'th' ? 'เกี่ยวกับผม' : 'About';
    const sideAbout = document.getElementById('sidebar-about-text');
    if (sideAbout) sideAbout.textContent = currentLang === 'th' ? 'เกี่ยวกับผม' : 'About';
    const footerAbout = document.getElementById('footer-about-text');
    if (footerAbout) footerAbout.textContent = currentLang === 'th' ? 'เกี่ยวกับผม' : 'About';

    if (lblFullname) lblFullname.textContent = currentLang === 'th' ? 'ชื่อ-นามสกุล' : 'Full Name';
    if (lblRole) lblRole.textContent = currentLang === 'th' ? 'ตำแหน่ง / ความเชี่ยวชาญ' : 'Role & Specialization';
    if (lblLocation) lblLocation.textContent = currentLang === 'th' ? 'สถานที่ทำงาน' : 'Location';
    if (lblStatus) lblStatus.textContent = currentLang === 'th' ? 'สถานะการรับงาน' : 'Work Status';

    const lblEmail = document.getElementById('lbl-email');
    if (lblEmail) lblEmail.textContent = currentLang === 'th' ? 'อีเมลติดต่อ' : 'Email Address';
    const lblLine = document.getElementById('lbl-line');
    if (lblLine) lblLine.textContent = currentLang === 'th' ? 'LINE Official' : 'LINE Official Account';

    if (aboutValName) aboutValName.textContent = `${p.name[currentLang] || p.name.en} (${p.nickname[currentLang] || p.nickname.en})`;
    if (aboutValRole) aboutValRole.textContent = p.role[currentLang] || p.role.en;
    if (aboutValLocation) aboutValLocation.textContent = p.location[currentLang] || p.location.en;
    if (aboutValStatus) aboutValStatus.textContent = p.status[currentLang] || p.status.en;

    // Contact Panel Sub
    if (contactPanelSub) {
      contactPanelSub.textContent = currentLang === 'th'
        ? 'มาเริ่มพัฒนาโปรเจกต์ด้วยกัน'
        : "Let's Team Up & Build Something Great";
    }
    if (contactPanelNote) {
      contactPanelNote.textContent = currentLang === 'th'
        ? 'พร้อมรับฟังไอเดียและให้คำปรึกษาในการพัฒนาซอฟต์แวร์ทุกรูปแบบ สามารถติดต่อได้ผ่านช่องทางด้านล่างนี้ครับ'
        : 'Tell me about your project, timeline, or requirements. Feel free to connect via any channel below!';
    }
  }

  function renderProfile() {
    const p = data.profile;
    if (!p) return;

    if (heroDescText) heroDescText.innerHTML = p.description[currentLang] || p.description.en;

    // About Me cards dynamic binding
    const aboutValEmail = document.getElementById('about-val-email');
    if (aboutValEmail && p.email) aboutValEmail.textContent = p.email;

    const aboutValLine = document.getElementById('about-val-line');
    if (aboutValLine) {
      aboutValLine.textContent = p.lineId || '';
    }

    // Contact values & links
    if (contactEmailVal && p.email) contactEmailVal.textContent = p.email;

    if (contactLineVal) {
      contactLineVal.textContent = p.lineId || '';
    }

    const contactLineLink = document.getElementById('contact-line-link');
    if (contactLineLink && p.lineUrl) {
      contactLineLink.href = p.lineUrl;
    }

    if (contactLocationVal) {
      contactLocationVal.textContent = p.location[currentLang] || p.location.en;
    }

    // Contact GitHub link & display text
    const contactGithubLink = document.getElementById('contact-github-link');
    const contactGithubVal = document.getElementById('contact-github-val');
    if (contactGithubLink && p.github) {
      contactGithubLink.href = p.github;
    }
    if (contactGithubVal && p.github) {
      const cleanGithub = p.github.replace(/^https?:\/\//, '').replace(/\/$/, '');
      contactGithubVal.textContent = cleanGithub;
    }

    // Footer social links
    const footerGithubLink = document.getElementById('footer-github-link');
    if (footerGithubLink && p.github) footerGithubLink.href = p.github;

    const footerLineLink = document.getElementById('footer-line-link');
    if (footerLineLink && p.lineUrl) footerLineLink.href = p.lineUrl;

    const footerEmailLink = document.getElementById('footer-email-link');
    if (footerEmailLink && p.email) footerEmailLink.href = `mailto:${p.email}`;

    // Footer Copyright
    const footerCopyright = document.getElementById('footer-copyright');
    if (footerCopyright) {
      const authorName = `${p.name[currentLang] || p.name.en} (${p.nickname[currentLang] || p.nickname.en})`;
      footerCopyright.textContent = `© 2026 ${authorName}. All rights reserved.`;
    }

    // Page title dynamic sync
    const currentName = p.name[currentLang] || p.name.en;
    const currentRole = p.role[currentLang] || p.role.en;
    document.title = `${currentName} | ${currentRole}`;
  }

  function renderSkills() {
    if (!skillsGrid || !data.skills) return;

    const filtered = data.skills.filter((skill) => {
      if (currentSkillCategory === 'all') return true;
      return skill.category === currentSkillCategory;
    });

    skillsGrid.innerHTML = filtered.map((skill) => `
      <div class="nichol-skill-card" data-category="${skill.category}">
        <div class="skill-header-row">
          <div class="skill-title-block">
            <span class="skill-emoji">${skill.icon}</span>
            <span class="skill-label-text">${skill.name}</span>
          </div>
        </div>
        <div class="skill-progress-row">
          <div class="skill-slider-track">
            <div class="skill-slider-fill" style="width: ${skill.level}%"></div>
            <div class="skill-slider-thumb" style="left: ${skill.level}%">
              <span class="thumb-core"></span>
            </div>
          </div>
          <span class="skill-percent-text">${skill.level}%</span>
        </div>
      </div>
    `).join('');
  }

  function renderProjects() {
    if (!projectsGrid || !data.projects) return;

    const filtered = data.projects.filter((project) => {
      if (currentProjectCategory === 'all') return true;
      return project.category === currentProjectCategory;
    });

    projectsGrid.innerHTML = filtered.map((proj) => {
      const badge = proj.badge[currentLang] || proj.badge.en || '';
      const title = proj.title[currentLang] || proj.title.en || '';
      const desc = proj.desc[currentLang] || proj.desc.en || '';
      const techBadges = (proj.tech || []).map((t) => `<span class="tech-pill tag-badge">${t}</span>`).join('');

      return `
        <article class="nichol-project-card project-box-card" data-category="${proj.category}">
          <div class="project-card-top project-card-top-row">
            <div class="project-icon-badge project-icon-cube">${proj.icon || '🚀'}</div>
            <span class="project-accent-tag project-accent-badge">${badge}</span>
          </div>
          <h3 class="project-card-title project-headline">${title}</h3>
          <p class="project-card-desc project-explanation">${desc}</p>
          <div class="project-tech-pills project-tags-group">
            ${techBadges}
          </div>
        </article>
      `;
    }).join('');
  }

  function renderExperience() {
    if (!experienceTimeline || !data.experience) return;

    experienceTimeline.innerHTML = data.experience.map((item) => {
      const period = item.period[currentLang] || item.period.en || '';
      const role = item.role[currentLang] || item.role.en || '';
      const desc = item.desc[currentLang] || item.desc.en || '';

      return `
        <div class="timeline-row">
          <div class="timeline-dot"></div>
          <div class="timeline-body-card">
            <div class="timeline-meta-row">
              <span class="timeline-year-tag">${period}</span>
              <span class="timeline-company-name">${item.company}</span>
            </div>
            <h3 class="timeline-job-role">${role}</h3>
            <p class="timeline-detail-desc">${desc}</p>
          </div>
        </div>
      `;
    }).join('');
  }

  function refreshUI() {
    updateStaticTranslations();
    renderProfile();
    renderSkills();
    renderProjects();
    renderExperience();
  }

  /* --------------------------------------------------------------------------
     5. Event Listeners & Interactions
     -------------------------------------------------------------------------- */
  // Language Switcher
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      currentLang = currentLang === 'th' ? 'en' : 'th';
      localStorage.setItem('portfolio_lang', currentLang);
      document.documentElement.setAttribute('lang', currentLang);
      refreshUI();
      resetTypewriter();
      showToast(currentLang === 'th' ? 'เปลี่ยนภาษาเป็น: ภาษาไทย 🇹🇭' : 'Language changed to: English 🇺🇸');
    });
  }

  // Theme Switcher (Dark / Light)
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      currentTheme = currentTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('portfolio_theme', currentTheme);
      document.documentElement.setAttribute('data-theme', currentTheme);
      showToast(currentTheme === 'dark' ? 'เปิดโหมดมืด 🌙' : 'เปิดโหมดสว่าง ☀️');
    });
  }

  // Skill Filter Tabs
  if (skillFilterTabs) {
    skillFilterTabs.addEventListener('click', (e) => {
      const tab = e.target.closest('.tab-chip, button');
      if (!tab) return;

      skillFilterTabs.querySelectorAll('.tab-chip, button').forEach((b) => b.classList.remove('active'));
      tab.classList.add('active');

      currentSkillCategory = tab.getAttribute('data-category') || 'all';
      renderSkills();
    });
  }

  // Project Filter Tabs
  if (projectFilterTabs) {
    projectFilterTabs.addEventListener('click', (e) => {
      const tab = e.target.closest('.tab-chip, button');
      if (!tab) return;

      projectFilterTabs.querySelectorAll('.tab-chip, button').forEach((b) => b.classList.remove('active'));
      tab.classList.add('active');

      currentProjectCategory = tab.getAttribute('data-filter') || 'all';
      renderProjects();
    });
  }

  // Copy Email to Clipboard
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = data.profile.email;
      if (!email) return;

      navigator.clipboard.writeText(email)
        .then(() => {
          showToast(currentLang === 'th' ? `คัดลอกอีเมลแล้ว: ${email}` : `Copied email: ${email}`);
        })
        .catch(() => {
          showToast(email);
        });
    });
  }

  // Contact Form Submission
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name')?.value;
      const email = document.getElementById('form-email')?.value;
      const subject = document.getElementById('form-subject')?.value || 'New Portfolio Inquiry';
      const message = document.getElementById('form-message')?.value;

      const t = data.translations[currentLang] || data.translations.en;
      showToast(t.toast_sent || (currentLang === 'th' ? 'ขอบคุณสำหรับข้อความครับ!' : 'Thank you! Message received.'));

      const mailtoUrl = `mailto:${data.profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`จาก: ${name} (${email})\n\n${message}`)}`;
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 700);

      contactForm.reset();
    });
  }

  // Mobile Sidebar Toggle
  function openMobileMenu() {
    if (mobileSidebar) mobileSidebar.classList.add('open');
    if (mobileOverlay) mobileOverlay.classList.add('open');
    if (mobileToggleBtn) mobileToggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (mobileSidebar) mobileSidebar.classList.remove('open');
    if (mobileOverlay) mobileOverlay.classList.remove('open');
    if (mobileToggleBtn) mobileToggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (mobileToggleBtn) mobileToggleBtn.addEventListener('click', openMobileMenu);
  if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', closeMobileMenu);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);
  sidebarLinks.forEach((link) => link.addEventListener('click', closeMobileMenu));

  // Scroll to Top Button
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Scroll Listeners
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Navbar Scrolled State
    if (navbar) {
      if (scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Scroll Top Button Visibility
    if (scrollTopBtn) {
      if (scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }

    // Active Navigation Highlight on Scroll
    const sections = document.querySelectorAll('section[id]');
    let currentSectionId = '';

    sections.forEach((sec) => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navItems.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });

  // Toast Helper
  let toastTimer = null;
  function showToast(msg) {
    if (!toast || !toastMessage) return;

    toastMessage.textContent = msg;
    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  /* --------------------------------------------------------------------------
     6. Initial Execution
     -------------------------------------------------------------------------- */
  refreshUI();
  resetTypewriter();
});
