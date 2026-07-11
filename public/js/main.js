// Importamos los datos centralizados 
import { portfolioData } from './config.js';
import { renderGitHubProjects } from './github.js';


document.addEventListener('DOMContentLoaded', () => {
    // Inicializo las funciones de renderizado 
    renderProfile();
    renderHomeSummary(); 
    renderAbout();
    renderEducation();
    renderGitHubProjects();
    initRouter();
    initMobileMenu();
});
function initRouter() {
    const handleRoute = () => {
        const currentHash = window.location.hash || '#home';
        const sections = document.querySelectorAll('.view-section');
        const navLinks = document.querySelectorAll('.nav-menu a');

        sections.forEach(section => {
            if (`#${section.id}` === currentHash) {
                section.classList.remove('hidden');
            } else {
                section.classList.add('hidden');
            }
        });

        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentHash) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };

    window.addEventListener('hashchange', handleRoute);
    handleRoute(); 
}

function renderProfile() {
    const { name, role, tagline, email, github, linkedin } = portfolioData.profile;
    
    // Verificaciones si no existe el ID, se salta sin romper el código
    const nameEl = document.getElementById('profile-name');
    if (nameEl) nameEl.textContent = name;
    
    const roleEl = document.getElementById('profile-role');
    if (roleEl) roleEl.textContent = role;
    
    const taglineEl = document.getElementById('hero-tagline');
    if (taglineEl) taglineEl.textContent = tagline;

    // botones del footer global
    const githubEl = document.getElementById('link-github');
    if (githubEl) githubEl.href = github;

    const linkedinEl = document.getElementById('link-linkedin');
    if (linkedinEl) linkedinEl.href = linkedin;

    const emailEl = document.getElementById('link-email');
    if (emailEl) emailEl.href = `mailto:${email}`;
}

function renderSkills() {
    const skillsGrid = document.getElementById('skills-grid');
    if (!skillsGrid) return;
    skillsGrid.innerHTML = '';
    portfolioData.skills.forEach(skill => {
        const skillCard = document.createElement('article');
        skillCard.className = 'skill-card';
        skillCard.innerHTML = `<h4>${skill.category}</h4><p>${skill.desc}</p>`;
        skillsGrid.appendChild(skillCard);
    });
}

function renderAbout() {
    const aboutSection = document.getElementById('about');
    if (!aboutSection || !portfolioData.about.paragraphs) return;

    let paragraphsContainer = aboutSection.querySelector('.about-text-block');
    
    if (!paragraphsContainer) {
        paragraphsContainer = document.createElement('div');
        paragraphsContainer.className = 'about-text-block';
        paragraphsContainer.style.cssText = "display: flex; flex-direction: column; gap: 1.2rem; max-width: 800px; margin-bottom: 3rem; margin-top: 2rem;";
        
        const h2 = aboutSection.querySelector('h2');
        if (h2) h2.insertAdjacentElement('afterend', paragraphsContainer);
    }

    paragraphsContainer.innerHTML = '';

    portfolioData.about.paragraphs.forEach(text => {
        const p = document.createElement('p');
        p.style.cssText = "color: var(--text-grey); font-size: 1.05rem; line-height: 1.6; text-align: justify;";
        
        const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        p.innerHTML = formattedText;
        
        paragraphsContainer.appendChild(p);
    });

    const styleToken = document.createElement('style');
    styleToken.innerHTML = ".about-text-block strong { color: var(--text-white); font-weight: 700; }";
    document.head.appendChild(styleToken);
}

/**
 * Renderiza la lista de títulos académicos en la sección Sobre Mí
 */
function renderEducation() {
    const educationList = document.getElementById('education-list');
    if (!educationList || !portfolioData.education) return;
    
    educationList.innerHTML = '';

    portfolioData.education.forEach(edu => {
        const eduItem = document.createElement('article');
        eduItem.style.cssText = `
            background-color: var(--bg-card); 
            border: 1px solid var(--border-color); 
            padding: 1.8rem; 
            border-radius: 12px;
            margin-bottom: 1.2rem;
            transition: var(--transition-fast);
            text-align: left;
        `;
        
        eduItem.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.6rem; flex-wrap: wrap; gap: 0.5rem;">
                <h4 style="font-size: 1.15rem; font-weight: 700; color: var(--text-white); font-family: var(--font-mono);">${edu.title}</h4>
                <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-lime); background-color: rgba(204,255,0,0.03); padding: 4px 10px; border-radius: 6px; border: 1px solid rgba(204,255,0,0.1);">${edu.date}</span>
            </div>
            <p style="font-size: 0.95rem; font-weight: 600; color: var(--text-grey); margin-bottom: 0.75rem;">${edu.institution}</p>
            <p style="font-size: 0.95rem; color: var(--text-grey); line-height: 1.5; text-align: justify;">${edu.description}</p>
        `;

        eduItem.addEventListener('mouseenter', () => {
            eduItem.style.borderColor = 'var(--accent-lime)';
        });
        eduItem.addEventListener('mouseleave', () => {
            eduItem.style.borderColor = 'var(--border-color)';
        });

        educationList.appendChild(eduItem);
    });
}
function renderHomeSummary() {
    const summary = portfolioData.homeSummary;
    if (!summary) return;

    
    const statusEl = document.getElementById('home-status');
    const locationEl = document.getElementById('home-location');
    const focusEl = document.getElementById('home-focus');

    if (statusEl) statusEl.textContent = summary.status;
    if (locationEl) locationEl.textContent = summary.location;
    if (focusEl) focusEl.textContent = summary.coreFocus;

    const tagsContainer = document.getElementById('home-stack-tags');
    if (!tagsContainer) return;
    
    tagsContainer.innerHTML = ''; // Limpio el contenedor

    // Construcción dinámica de mis categorías de GitHub
    for (const [categoryName, technologies] of Object.entries(summary.techStack)) {
        
        const categoryBlock = document.createElement('div');
        categoryBlock.style.cssText = "margin-bottom: 1.8rem; width: 100%; text-align: left;";
        
        const label = document.createElement('p');
        label.style.cssText = "font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-grey); margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 0.5rem;";
        label.innerHTML = `<span style="color: var(--accent-lime);">↳</span> ${categoryName}`;
        
        const rowWrapper = document.createElement('div');
        rowWrapper.className = 'tags-wrapper';
        
        technologies.forEach(tech => {
            const span = document.createElement('span');
            span.className = 'tech-tag';
            span.textContent = tech;
            rowWrapper.appendChild(span);
        });
        
        categoryBlock.appendChild(label);
        categoryBlock.appendChild(rowWrapper);
        tagsContainer.appendChild(categoryBlock);
    }
}
    /*
 * Control de apertura y cierre automático del menú interactivo en móviles
 */
    function initMobileMenu() {
        const toggleBtn = document.getElementById('menu-toggle');
        const navbar = document.querySelector('.navbar');
        const menuLinks = document.querySelectorAll('.nav-menu a');

        if (!toggleBtn || !navbar) return;

        // Al hacer clic en el botón, alternamos la clase .open para transformarlo y mostrar el menú
        toggleBtn.addEventListener('click', () => {
            navbar.classList.toggle('open');
        });

        // Mecanismo de auto-cierre: cuando se pulsa un enlace, el menú se pliega solo instantáneamente
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                navbar.classList.remove('open');
            });
        });
    }


