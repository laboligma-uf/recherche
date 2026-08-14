import { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  BookOpen,
  ChevronRight,
  CircleAlert,
  Mail,
  MapPin,
  Search,
  Sparkles,
  Users,
} from 'lucide-react';

type Publication = {
  Sujet: string;
  Auteur: string;
  DOI: string;
};

const jsonPath = '/publications.json';

function App() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    fetch(jsonPath)
      .then((response) => {
        if (!response.ok) throw new Error('Le fichier des publications est introuvable.');
        return response.json() as Promise<Publication[]>;
      })
      .then((data) => {
        const validRows = data.filter(
          (row) => row.Sujet && row.Auteur && row.DOI
        );
        if (validRows.length === 0) {
          throw new Error('Aucune publication valide n’a été trouvée dans le fichier.');
        }
        setPublications(validRows);
      })
      .catch((error: Error) => setLoadError(error.message))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredPublications = useMemo(() => {
    const query = search.toLocaleLowerCase('fr');
    if (!query) return publications;
    return publications.filter((publication) =>
      `${publication.Sujet} ${publication.Auteur}`.toLocaleLowerCase('fr').includes(query)
    );
  }, [publications, search]);

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#accueil" aria-label="Accueil LIGMA">
            <img src="/ligma-logo.svg" alt="Logo du laboratoire LIGMA" />
            <span className="brand-copy">
              <strong>LIGMA</strong>
              <span>Laboratoire de recherche</span>
            </span>
          </a>
          <a className="header-contact" href="mailto:ligma@univ-fianarantsoa.mg">
            <Mail size={16} />
            <span>Nous contacter</span>
          </a>
        </div>
      </header>

      <main>
        <section className="hero" id="accueil">
          <div className="hero-grid" />
          <div className="hero-inner">
            <div className="hero-content">
              <div className="eyebrow"><span /> Université de Fianarantsoa</div>
              <h1>Explorer les idées qui <em>façonnent</em> demain.</h1>
              <p className="hero-lead">
                Le Laboratoire Informatique, Géomatique, Modélisation et Applications rassemble des chercheurs qui transforment les données et les territoires en solutions utiles.
              </p>
              <a href="#publications" className="primary-button">
                Découvrir nos publications <ChevronRight size={17} />
              </a>
            </div>
            <div className="hero-note">
              <Sparkles size={19} />
              <span>Recherche · Innovation · Impact</span>
            </div>
          </div>
        </section>

        <section className="intro-section page-width">
          <div className="section-kicker">À propos du laboratoire</div>
          <div className="intro-layout">
            <h2>Des savoirs ancrés dans les réalités de Madagascar.</h2>
            <div className="intro-copy">
              <p>
                LIGMA développe des recherches à la croisée de l’informatique, de la géomatique et de la modélisation. Nos travaux accompagnent les enjeux scientifiques, environnementaux et sociaux de notre territoire.
              </p>
              <p className="intro-caption">Une communauté scientifique ouverte, curieuse et engagée.</p>
            </div>
          </div>
        </section>

        <section className="publications-section page-width" id="publications">
          <div className="section-heading">
            <div>
              <div className="section-kicker">Production scientifique</div>
              <h2>Publications du laboratoire</h2>
            </div>
            <div className="publication-count">
              <strong>{publications.length}</strong>
              <span>publications<br />référencées</span>
            </div>
          </div>

          <div className="toolbar">
            <label className="search-box">
              <Search size={19} />
              <span className="sr-only">Rechercher une publication</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher par sujet ou auteur..."
              />
              {search && <button type="button" onClick={() => setSearch('')} aria-label="Effacer la recherche">×</button>}
            </label>
            <span className="results-label">
              {search ? `${filteredPublications.length} résultat${filteredPublications.length > 1 ? 's' : ''}` : 'Toutes les publications'}
            </span>
          </div>

          {loadError && (
            <div className="notice" role="status"><CircleAlert size={18} /> {loadError}</div>
          )}

          {isLoading ? (
            <div className="publication-list" aria-label="Chargement des publications">
              {[1, 2, 3].map((item) => <div className="skeleton-card" key={item} />)}
            </div>
          ) : filteredPublications.length > 0 ? (
            <div className="publication-list">
              {filteredPublications.map((publication, index) => (
                <article className="publication-card" key={`${publication.DOI}-${index}`}>
                  <div className="card-index">{String(index + 1).padStart(2, '0')}</div>
                  <div className="card-main">
                    <div className="card-topic"><BookOpen size={15} /> Article scientifique</div>
                    <h3>{publication.Sujet}</h3>
                    <div className="author-line"><Users size={16} /><span>{publication.Auteur}</span></div>
                  </div>
                  <a className="article-link" href={publication.DOI} target="_blank" rel="noreferrer">
                    <span>Voir l’article</span><ArrowUpRight size={18} />
                  </a>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state"><Search size={24} /><h3>Aucun résultat</h3><p>Essayez un autre sujet ou nom d’auteur.</p></div>
          )}
        </section>

        <section className="contact-strip">
          <div className="page-width contact-inner">
            <div>
              <div className="section-kicker">Une question sur nos travaux ?</div>
              <h2>Échangeons autour de la recherche.</h2>
            </div>
            <a className="light-button" href="mailto:ligma@univ-fianarantsoa.mg">Prendre contact <ArrowUpRight size={17} /></a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-width footer-inner">
          <div className="footer-brand"><img src="/ligma-logo.svg" alt="" /><span>LIGMA</span></div>
          <div className="footer-details"><span><MapPin size={15} /> Université de Fianarantsoa, Madagascar</span><a href="mailto:ligma@univ-fianarantsoa.mg"><Mail size={15} /> ligma@univ-fianarantsoa.mg</a></div>
          <div className="footer-year">© {new Date().getFullYear()} LIGMA</div>
        </div>
      </footer>
    </div>
  );
}

export default App;
