// ===== Smooth Scrolling =====
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ===== Tab Switching =====
function switchTab(tabName) {
    // Remove active class from all tabs and panels
    const tabButtons = document.querySelectorAll('.tab-button');
    const demoPanels = document.querySelectorAll('.demo-panel');
    
    tabButtons.forEach(button => button.classList.remove('active'));
    demoPanels.forEach(panel => panel.classList.remove('active'));
    
    // Add active class to selected tab and panel
    const activeButton = Array.from(tabButtons).find(
        button => button.textContent.toLowerCase().includes(tabName)
    );
    const activePanel = document.getElementById(`${tabName}-demo`);
    
    if (activeButton) activeButton.classList.add('active');
    if (activePanel) activePanel.classList.add('active');
}

// ===== Copy Code Functionality =====
function copyCode() {
    const codeSnippet = document.getElementById('code-snippet');
    const textToCopy = codeSnippet.textContent;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        const copyBtn = document.querySelector('.copy-btn');
        const originalText = copyBtn.textContent;
        
        copyBtn.textContent = '✓ Copiado!';
        copyBtn.style.background = 'var(--success)';
        copyBtn.style.color = 'white';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = 'transparent';
            copyBtn.style.color = 'var(--text-secondary)';
        }, 2000);
    }).catch(err => {
        console.error('Erro ao copiar:', err);
    });
}

// ===== Scroll Animations =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Observe stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Observe info items
    const infoItems = document.querySelectorAll('.info-item');
    infoItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });
}

// ===== Navbar Scroll Effect =====
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.background = 'rgba(15, 23, 42, 0.9)';
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)';
            navbar.style.padding = '1rem 0';
        } else {
            navbar.style.background = 'transparent';
            navbar.style.backdropFilter = 'none';
            navbar.style.boxShadow = 'none';
            navbar.style.padding = '2rem 0';
        }
        
        navbar.style.transition = 'all 0.3s ease';
        lastScroll = currentScroll;
    });
}

// ===== Particle Effect on Mouse Move =====
function initParticleEffect() {
    const hero = document.querySelector('.hero');
    let particles = [];
    const maxParticles = 50;
    
    hero.addEventListener('mousemove', (e) => {
        if (particles.length < maxParticles) {
            createParticle(e.clientX, e.clientY);
        }
    });
    
    function createParticle(x, y) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.borderRadius = '50%';
        particle.style.background = 'rgba(99, 102, 241, 0.6)';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1';
        particle.style.transition = 'all 1s ease-out';
        
        document.body.appendChild(particle);
        particles.push(particle);
        
        setTimeout(() => {
            particle.style.opacity = '0';
            particle.style.transform = 'translateY(-50px) scale(0)';
        }, 10);
        
        setTimeout(() => {
            document.body.removeChild(particle);
            particles = particles.filter(p => p !== particle);
        }, 1000);
    }
}

// ===== Counter Animation for Stats =====
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

function initCounters() {
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                const text = entry.target.textContent;
                
                // Only animate numeric values
                if (text.includes('10x')) {
                    let count = 0;
                    const interval = setInterval(() => {
                        count++;
                        entry.target.textContent = count + 'x';
                        if (count >= 10) clearInterval(interval);
                    }, 100);
                } else if (text.includes('99%')) {
                    let count = 0;
                    const interval = setInterval(() => {
                        count++;
                        entry.target.textContent = count + '%';
                        if (count >= 99) clearInterval(interval);
                    }, 20);
                }
            }
        });
    }, observerOptions);
    
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => observer.observe(stat));
}

// ===== Typing Effect for Code Demo =====
function initTypingEffect() {
    const codeElement = document.getElementById('code-snippet');
    const originalCode = codeElement.textContent;
    codeElement.textContent = '';
    
    let index = 0;
    const typingSpeed = 15;
    
    function type() {
        if (index < originalCode.length) {
            codeElement.textContent += originalCode.charAt(index);
            index++;
            setTimeout(type, typingSpeed);
        }
    }
    
    // Start typing when code demo is visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && index === 0) {
                type();
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(codeElement);
}

// ===== Initialize All Features =====
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initNavbarScroll();
    initParticleEffect();
    initCounters();
    initTypingEffect();
    
    // Add smooth reveal to sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.8s ease';
    });
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => sectionObserver.observe(section));
});

// ===== Easter Egg: Konami Code =====
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateEasterEgg();
    }
});

function activateEasterEgg() {
    document.body.style.animation = 'rainbow 2s linear infinite';
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
        document.body.style.animation = '';
        style.remove();
    }, 5000);
    
    console.log('🎉 Easter egg ativado! Você descobriu o segredo do Antigravity!');
}
