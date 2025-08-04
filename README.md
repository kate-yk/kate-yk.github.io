<!-- 
 @requires
 1. VSCode extension: Markdown Preview Enhanced
 2. Shortcut: 'Ctrl/Command' + 'Shift' + 'V'
 3. Split: Drag to right (->)

 @requires
 1. VSCode extension: Markdown All in One
 2. `File` > `Preferences` > `Keyboard Shortcuts`
 3. toggle code span > `Ctrl + '`
 4. toggle code block > `Ctrl + Shift + '`

 @usage
 1. End of Proof (Q.E.D.): <div style="text-align: right;">&#11035;</div>
 2. End of Each Section: 

     <br /><br /><br />

     ---



     <p align="right">(<a href="#readme-top">back to top</a>)</p>
     

 3. ![image_title_](images/imagefile.png)
 4. [url_title](URL)
 -->
<!-- Anchor Tag (Object) for "back to top" -->
<a id="readme-top"></a>




---

# GYCO Institution Website by Kate

Greater Youth Collaborative Opus (GYCO) - A comprehensive website for the GYCO institution featuring orchestra programs, volunteer opportunities, research articles, and collaborative innovation.

## Project Overview
This project creates a modern, responsive website for the GYCO institution using Bootstrap 5 and modern web technologies. The website serves as a comprehensive platform for youth music education, research, and community engagement.

## Instructions
Follow the steps below to start off.
1. open the terminal by pressing `ctrl + ~`
2. type-in `./on_venv.sh`
3. copy and paste `source ../venv/bin/activate && pip install setuptools && clear`
4. If you can see `(venv)` at the front of your terminal line, you are all set.
5. Run your python file. `python app.py`

**Note**: when you type-in, you can `tap` so the bash can automatically generate your space (folder) name.

## Table of Contents
- [GYCO Institution Website by Kate](#gyco-institution-website-by-kate)
  - [Project Overview](#project-overview)
  - [Instructions](#instructions)
  - [Table of Contents](#table-of-contents)
- [Features](#features)
  - [Core Sections](#core-sections)
  - [Design Features](#design-features)
  - [Technical Features](#technical-features)
- [Technology Stack](#technology-stack)
  - [Frontend Technologies](#frontend-technologies)
  - [Development Tools](#development-tools)
  - [Browser Support](#browser-support)
- [File Structure](#file-structure)
  - [Key Files Description](#key-files-description)
- [Development](#development)
  - [Local Development Setup](#local-development-setup)
  - [Development Features](#development-features)
  - [Deployment](#deployment)
- [Documentations](#documentations)
  - [Project Purpose](#project-purpose)
  - [Key Objectives](#key-objectives)
  - [Target Audience](#target-audience)
  - [Content Strategy](#content-strategy)
    - [Orchestra Section](#orchestra-section)
    - [Volunteer Section](#volunteer-section)
    - [Articles Section](#articles-section)
    - [Research Section](#research-section)
    - [Publish Section](#publish-section)
    - [Contact Section](#contact-section)
  - [Technical Implementation](#technical-implementation)
    - [Responsive Design](#responsive-design)
    - [Performance Optimization](#performance-optimization)
    - [Accessibility Features](#accessibility-features)
    - [Security Considerations](#security-considerations)
  - [Future Enhancements](#future-enhancements)
    - [Phase 2 Features](#phase-2-features)
    - [Technical Improvements](#technical-improvements)
    - [Content Management](#content-management)
- [References](#references)
  - [Website Reference](#website-reference)
  - [Original Website Reference](#original-website-reference)
  - [Additional Resources](#additional-resources)




<br /><br /><br />

---

# Features

## Core Sections
- **Orchestra (GYCO)** - Youth orchestra programs, ensemble groups, and performances
- **Volunteer** - Community outreach programs and mentorship opportunities
- **Articles** - Math and Medical articles related to music education
- **Research** - Math and Medical research in music theory and therapy
- **Publish** - Publication platform for research and creative works
- **Contact** - Contact information and communication channels

## Design Features
- **Responsive Design** - Fully responsive using Bootstrap 5
- **Modern UI** - Professional gradient backgrounds and hover effects
- **Mobile-First** - Optimized for all device sizes
- **Accessibility** - WCAG compliant design elements
- **Performance** - Fast loading with optimized assets

## Technical Features
- **Bootstrap 5.3.0** - Latest responsive framework
- **Font Awesome Icons** - Professional iconography
- **CSS Custom Properties** - Maintainable styling
- **Smooth Animations** - Enhanced user experience
- **Cross-Browser Compatible** - Works on all modern browsers

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<br /><br /><br />

---

# Technology Stack

## Frontend Technologies
- **HTML5** - Semantic markup structure
- **CSS3** - Modern styling with custom properties
- **Bootstrap 5.3.0** - Responsive framework
- **Font Awesome 6.0.0** - Icon library
- **JavaScript ES6+** - Interactive functionality

## Development Tools
- **Python Flask** - Backend server (app.py)
- **Git** - Version control
- **GitHub Pages** - Deployment platform
- **VSCode** - Development environment

## Browser Support
- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<br /><br /><br />

---

# File Structure

```
98-web_gyco/
├── app.py                 # Flask application server
├── on_venv.sh            # Virtual environment setup script
├── README.md             # Project documentation
├── LICENSE               # Project license
├── static/               # Static assets directory
│   ├── index.html        # Admin/redirect navigation hub
│   ├── refreshpage.js    # Auto-refresh functionality
│   ├── dev-refresh.js    # Development-only refresh
│   ├── smart-refresh.js  # Smart content refresh
│   ├── manual-refresh.js # Manual refresh button
│   └── gyco/            # GYCO website directory
│       └── index.html    # Main GYCO institution website
└── docs/                # Documentation directory
    └── index.html        # Additional documentation
```

## Key Files Description
- **`static/index.html`** - Admin navigation hub for multiple projects
- **`static/gyco/index.html`** - Complete GYCO institution website
- **`app.py`** - Flask server for local development
- **`refreshpage.js`** - Auto-refresh functionality for development

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<br /><br /><br />

---

# Development

## Local Development Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/kate-yk/kate-yk.github.io.git
   cd kate-yk.github.io.git
   ```

2. **Set up virtual environment (follow the instructions)**
   ```bash
   ./on_venv.sh
   ```

3. **Run the development server**
   ```bash
   python app.py
   ```

4. **Access the website**
   - Admin Hub: `http://localhost:5000/index.html`
   - GYCO Website: `http://localhost:5000/gyco/index.html`

## Development Features
- **Auto-refresh** - Development environment includes smart refresh functionality
- **Hot reload** - Changes reflect immediately in browser
- **Error handling** - Comprehensive error logging and debugging
- **Responsive testing** - Test on multiple device sizes

## Deployment
The project is configured for deployment on **GitHub Pages** with the following structure:
- Main navigation: `https://kate-yk.github.io/index.html`
- GYCO website: `https://kate-yk.github.io/gyco/home.html`

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<br /><br /><br />

---

# Documentations

## Project Purpose
The GYCO Institution Website serves as a comprehensive digital platform for the Greater Youth Collaborative Opus organization. It provides a modern, accessible interface for youth music education, research collaboration, and community engagement.

## Key Objectives
1. **Digital Transformation** - Replace legacy systems with modern web technologies
2. **Youth Engagement** - Create an engaging platform for young musicians
3. **Research Collaboration** - Facilitate academic and medical research in music
4. **Community Outreach** - Connect volunteers and mentors with youth programs
5. **Accessibility** - Ensure the platform is accessible to all users

## Target Audience
- **Youth Musicians** - Primary users seeking orchestra and ensemble opportunities
- **Researchers** - Academic and medical professionals studying music therapy
- **Volunteers** - Community members wanting to contribute to youth programs
- **Educators** - Music teachers and mentors
- **Administrators** - GYCO staff and management

## Content Strategy
The website is organized into six main sections, each serving specific user needs:

### Orchestra Section
- Youth orchestra programs and auditions
- Ensemble group opportunities
- Performance schedules and events
- Musical education resources

### Volunteer Section
- Community outreach programs
- Mentorship opportunities
- Volunteer registration and training
- Impact stories and testimonials

### Articles Section
- **Math Articles** - Mathematical concepts in music theory
- **Medical Articles** - Music therapy research and applications
- Academic publications and research papers
- Educational resources and tutorials

### Research Section
- **Math Research** - Algorithmic composition and music theory
- **Medical Research** - Neurological effects of music
- Research collaboration opportunities
- Publication guidelines and standards

### Publish Section
- Research submission platform
- Creative works showcase
- Publication guidelines
- Peer review process

### Contact Section
- Organization contact information
- Location and hours
- Social media links
- Communication channels

## Technical Implementation
The website is built using modern web standards and best practices:

### Responsive Design
- Mobile-first approach using Bootstrap 5
- Percentage-based layouts (no hardcoded pixels)
- Flexible grid system for all screen sizes
- Touch-friendly navigation and interactions

### Performance Optimization
- Optimized images and assets
- Minified CSS and JavaScript
- Efficient loading strategies
- Browser caching implementation

### Accessibility Features
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast color schemes

### Security Considerations
- HTTPS implementation
- Content Security Policy (CSP)
- Input validation and sanitization
- Secure external resource loading

## Future Enhancements
Planned improvements and additional features:

### Phase 2 Features
- User authentication and profiles
- Interactive music learning tools
- Real-time collaboration features
- Advanced search and filtering
- Multi-language support

### Technical Improvements
- Progressive Web App (PWA) capabilities
- Advanced caching strategies
- Performance monitoring
- Analytics integration
- SEO optimization

### Content Management
- Dynamic content management system
- Blog and news section
- Event calendar integration
- Social media integration
- Newsletter subscription

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<br /><br /><br />

---

# References

## Website Reference
The project is deployed using **GitHub Pages** for high availability and accessibility. The interactive data story is publicly accessible via the following URL, **[Project Website](https://kate-yk.github.io/gyco/home.html)**.

## Original Website Reference
The project is a derived work from existing website, to replace old legacy and apply new technology. The parent website is publicly and offically accessible via the following URL, **[Original Website](https://gyco-opus.org/)**.

## Additional Resources
- **Bootstrap Documentation** - [getbootstrap.com](https://getbootstrap.com/docs/)
- **Font Awesome Icons** - [fontawesome.com](https://fontawesome.com/)
- **GitHub Pages** - [pages.github.com](https://pages.github.com/)
- **Web Accessibility Guidelines** - [w3.org/WAI](https://www.w3.org/WAI/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>