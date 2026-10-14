import { portfolioData } from './config.js';

/**
 * Conecta con la API de GitHub, recupera mis repositorios 
 * y los renderiza dinámicamente en la interfaz.
 */
export async function renderGitHubProjects(language = 'es') {
    const container = document.getElementById('github-projects');
    if (!container) return;

    // Cojo el nombre de usuario directamente desde la URL de mi config.js
    const githubUrl = portfolioData.profile.github;
    const username = githubUrl.split('/').filter(Boolean).pop();

    try {
// Hacemos la petición ordenando por orden de creación 
const response = await fetch(`https://api.github.com/users/${username}/repos?sort=created&direction=desc&per_page=12`);
        
        if (!response.ok) {
            throw new Error('No se pudo obtener respuesta de GitHub');
        }

        const repos = await response.json();
        container.innerHTML = ''; // Limpiamos 

        // Filtramos: 
        const filteredRepos = repos.filter(repo => {
            const isFork = repo.fork;
            const isPortfolioRepo = repo.name.toLowerCase() === `${username}.github.io`.toLowerCase();
            return !isFork && !isPortfolioRepo;
        });

        if (filteredRepos.length === 0) {
            container.innerHTML = `<p class="loading">${language === 'en' ? 'No public repositories found.' : 'No se encontraron repositorios públicos propios.'}</p>`;
            return;
        }

        // Iteramos sobre mis proyectos para enseñarlos en las tarjetas
filteredRepos.forEach(repo => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';

            // Estructura adaptada para el efecto Hover Text Reveal
            projectCard.innerHTML = `
                <div style="padding: 2rem; height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
                    <span style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--accent-lime); font-weight: 700;">${repo.language || 'Docs'}</span>
                    <h4 style="font-family: var(--font-mono); font-size: 1.2rem; font-weight: 700; text-transform: uppercase;">${repo.name}</h4>
                </div>
                
                <div class="project-overlay">
                    <div>
                        <h3>${repo.name}</h3>
                        <p style="color: var(--text-grey); font-size: 0.9rem; line-height: 1.4; margin-top: 1rem;">
                            ${repo.description || (language === 'en' ? 'Technical project focused on development and cybersecurity.' : 'Proyecto técnico enfocado en desarrollo y seguridad informática.')}
                        </p>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; font-family: var(--font-mono); font-size: 0.8rem;">
                        <span style="color: var(--text-white); font-weight: 700;">${repo.language || 'Docs'}</span>
                        <a href="${repo.html_url}" target="_blank" style="color: var(--accent-lime); text-decoration: none; font-weight: 700;">${language === 'en' ? 'SOURCE CODE' : 'CÓDIGO FUENTE'} →</a>
                    </div>
                </div>
            `;

            container.appendChild(projectCard);
        });

    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        container.innerHTML = `
            <p class="loading" style="color: #f87171;">
                [!] ${language === 'en' ? 'Could not connect to the GitHub API. Check the console or your connection.' : 'Error al conectar con la API de GitHub. Revisa la consola o tu conexión.'}
            </p>
        `;
    }
}