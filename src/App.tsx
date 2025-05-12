import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// URL del API Gateway (reemplazar con tu URL real)
const API_URL = 'https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/prod';

// Definimos interfaces para nuestros tipos
interface Project {
  id: string;
  name: string;
  description: string;
  image: string;
  githubLink: string;
  projectLink: string;
  tags: string[];
}

interface NewProject {
  name: string;
  githubLink: string;
  projectLink: string;
  image: string;
  tags: string[];
}

// Datos de ejemplo con URLs simplificadas (usados como fallback si la API falla)
const demoProjects: Project[] = [
  {
    id: "1",
    name: "AI Image Generator",
    description: "Generate images with AI",
    image: "https://es.unesco.org/youth/toptips/user/pages/images/home-feature-two_mobile.png",
    githubLink: "https://github.com",
    projectLink: "https://google.com",
    tags: ["Generative AI", "ML"]
  },
  {
    id: "2",
    name: "Data Analytics Dashboard",
    description: "Interactive dashboard",
    image: "https://es.unesco.org/youth/toptips/user/pages/images/home-feature-two_mobile.png",
    githubLink: "https://github.com",
    projectLink: "https://google.com",
    tags: ["Analytics"]
  },
  {
    id: "3",
    name: "AR Game Experience",
    description: "Augmented reality gaming",
    image: "https://es.unesco.org/youth/toptips/user/pages/images/home-feature-two_mobile.png",
    githubLink: "https://github.com",
    projectLink: "https://google.com",
    tags: ["Games", "M&E"]
  },
  {
    id: "4",
    name: "ML Recommendation Engine",
    description: "ML recommendations",
    image: "https://es.unesco.org/youth/toptips/user/pages/images/home-feature-two_mobile.png",
    githubLink: "https://github.com",
    projectLink: "https://google.com",
    tags: ["ML"]
  },
  {
    id: "5",
    name: "Video Processing App",
    description: "Media processing",
    image: "https://es.unesco.org/youth/toptips/user/pages/images/home-feature-two_mobile.png",
    githubLink: "https://github.com",
    projectLink: "https://google.com",
    tags: ["Generative AI", "M&E"]
  },
  {
    id: "6",
    name: "Big Data Processing App",
    description: "Data processing",
    image: "https://es.unesco.org/youth/toptips/user/pages/images/home-feature-two_mobile.png",
    githubLink: "https://github.com",
    projectLink: "https://google.com",
    tags: ["ML", "Analytics"]
  }
];

const availableTags: string[] = ["Games", "M&E", "Analytics", "ML", "Generative AI"];

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [newProject, setNewProject] = useState<NewProject>({
    name: '',
    githubLink: '',
    projectLink: '',
    image: '',
    tags: []
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Referencias para detectar clics fuera de componentes
  const sidebarRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cargar proyectos desde la API cuando el componente se monta
  useEffect(() => {
    fetchProjects();
  }, []);

  // Función para obtener proyectos de la API
  async function fetchProjects() {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/projects`);
      
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
        setFilteredProjects(data);
      } else {
        console.error('Error fetching projects from API:', response.statusText);
        // Usar datos de demostración como respaldo
        setProjects(demoProjects);
        setFilteredProjects(demoProjects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      // Usar datos de demostración como respaldo en caso de error
      setProjects(demoProjects);
      setFilteredProjects(demoProjects);
    } finally {
      setIsLoading(false);
    }
  }

  // Filtrado de proyectos
  useEffect(() => {
    let result = projects;
    
    if (searchTerm) {
      result = result.filter(project => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedTags.length > 0) {
      result = result.filter(project => 
        selectedTags.some(tag => project.tags.includes(tag))
      );
    }
    
    setFilteredProjects(result);
  }, [searchTerm, selectedTags, projects]);

  // Detectar clics fuera para cerrar componentes
  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (!(event.target instanceof Element)) return;

      // Cerrar sidebar si está abierto y se hace clic fuera
      if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target) && 
          !event.target.classList.contains('menu-btn')) {
        setIsSidebarOpen(false);
      }
      
      // Cerrar dropdown si está abierto y se hace clic fuera
      if (showDropdown && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen, showDropdown]);

  // Sidebar Toggle
  const toggleSidebar = (): void => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Dropdown Toggle
  const toggleDropdown = (): void => {
    setShowDropdown(!showDropdown);
  };

  // Reset filtros
  const resetFilters = (): void => {
    setSearchTerm('');
    setSelectedTags([]);
    setIsSidebarOpen(false);
  };

  // Manejo de tags
  const handleTagSelect = (tag: string): void => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setShowDropdown(false);
  };

  const handleTagRemove = (tag: string): void => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  // Manejo del formulario de nuevo proyecto
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setNewProject({
      ...newProject,
      [name]: value
    });
  };

  const handleTagToggle = (tag: string): void => {
    const currentTags = [...newProject.tags];
    if (currentTags.includes(tag)) {
      setNewProject({
        ...newProject,
        tags: currentTags.filter(t => t !== tag)
      });
    } else {
      setNewProject({
        ...newProject,
        tags: [...currentTags, tag]
      });
    }
  };

  // Función para añadir un nuevo proyecto mediante la API
  const handleAddProject = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    // Usar imagen predeterminada si no se proporciona una
    const imageUrl = newProject.image || 
      `https://via.placeholder.com/500x300/1e1e1e/ff7d00?text=${encodeURIComponent(newProject.name)}`;
    
    const projectToAdd = {
      name: newProject.name,
      description: "New project",
      image: imageUrl,
      githubLink: newProject.githubLink,
      projectLink: newProject.projectLink,
      tags: newProject.tags
    };
    
    try {
      // Hacer POST a la API para crear un nuevo proyecto
      const response = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectToAdd),
      });
      
      if (response.ok) {
        // Si la respuesta es exitosa, recargar los proyectos
        await fetchProjects();
      } else {
        console.error('Error creating project:', response.statusText);
        alert(`Error creating project: ${response.statusText}`);
        
        // Fallback: añadir localmente si la API falla
        const localProjectToAdd: Project = {
          id: Date.now().toString(),
          ...projectToAdd
        };
        setProjects([...projects, localProjectToAdd]);
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Error creating project. Please try again.');
      
      // Fallback: añadir localmente si la API falla
      const localProjectToAdd: Project = {
        id: Date.now().toString(),
        ...projectToAdd
      };
      setProjects([...projects, localProjectToAdd]);
    }
    
    // Resetear formulario
    setNewProject({
      name: '',
      githubLink: '',
      projectLink: '',
      image: '',
      tags: []
    });
    
    setIsAddModalOpen(false);
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <header className="header">
        <div className="navbar">
          <button onClick={toggleSidebar} className="menu-btn">
            <span>☰</span>
          </button>
          <h1 className="brand">OrangeSlice</h1>
          
          <div className="search-container">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                placeholder="Search projects..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filter-tags">
              {selectedTags.map(tag => (
                <span key={tag} className="selected-tag">
                  {tag}
                  <button 
                    onClick={() => handleTagRemove(tag)}
                    className="tag-remove"
                  >×</button>
                </span>
              ))}
              
              <div className="filter-dropdown" ref={dropdownRef}>
                <button 
                  className="filter-btn"
                  onClick={toggleDropdown}
                >
                  Filter
                </button>
                {showDropdown && (
                  <div className="dropdown-content">
                    {availableTags.map(tag => (
                      <button 
                        key={tag}
                        onClick={() => handleTagSelect(tag)}
                        className="tag-option"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <button 
            className="add-btn"
            onClick={() => setIsAddModalOpen(true)}
          >
            + Add Project
          </button>
        </div>
      </header>
      
      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="sidebar" ref={sidebarRef}>
          <div className="sidebar-content">
            <button onClick={resetFilters} className="sidebar-option">
              <span>🏠</span> Home
            </button>
            <button className="sidebar-option">
              <span>🚪</span> Sign out
            </button>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main className="main-content">
        {isLoading ? (
          <div className="loading">Loading projects...</div>
        ) : (
          <div className="project-grid">
            {filteredProjects.length > 0 ? (
              filteredProjects.map(project => (
                <div key={project.id} className="project-card">
                  <div 
                    className="project-image" 
                    style={{backgroundImage: `url(${project.image})`}}
                  >
                    <div className="project-overlay">
                      <a 
                        href={project.projectLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="project-title"
                      >
                        {project.name}
                      </a>
                      <a 
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="github-link"
                      >
                        <span>GitHub</span>
                      </a>
                    </div>
                  </div>
                  <div className="project-tags">
                    {project.tags.map(tag => (
                      <span key={tag} className="project-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-projects">
                <p>No projects found. Try adding a new project or changing your filters.</p>
              </div>
            )}
          </div>
        )}
      </main>
      
      {/* Modal para añadir proyecto */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal" ref={modalRef}>
            <div className="modal-header">
              <h2>Add New Project</h2>
              <button 
                className="close-btn"
                onClick={() => setIsAddModalOpen(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleAddProject} className="add-project-form">
              <div className="form-group">
                <label>Project Name *</label>
                <input
                  type="text"
                  name="name"
                  value={newProject.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>GitHub Link *</label>
                <input
                  type="url"
                  name="githubLink"
                  value={newProject.githubLink}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Project Link *</label>
                <input
                  type="url"
                  name="projectLink"
                  value={newProject.projectLink}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Image URL (optional)</label>
                <input
                  type="url"
                  name="image"
                  value={newProject.image}
                  onChange={handleInputChange}
                />
                <small>Leave empty to use default image</small>
              </div>
              
              <div className="form-group">
                <label>Tags *</label>
                <div className="tag-container">
                  {availableTags.map(tag => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`tag-btn ${newProject.tags.includes(tag) ? 'active' : ''}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={!newProject.name || !newProject.githubLink || !newProject.projectLink || newProject.tags.length === 0}
                >
                  Add Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;