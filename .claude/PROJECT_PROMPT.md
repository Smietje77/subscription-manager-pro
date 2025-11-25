# Subscription Manager Pro

**Project Type:** SAAS  
**Complexity:** moderate  
**Estimated Duration:** 2-4 weeks  
**Team Size:** 3 AI Agents

Generated: 2025-11-21T20:23:58.300Z

---

## 📋 Project Context

### Description
Dit document beschrijft de volledige functionele en technische eisen voor een moderne, schaalbare Subscription Manager met:

OAuth-authenticatie via Supabase

Supabase Postgres als database & gegevensbeheer

Volledige backend + admin waar alle data beheerd kan worden

Meertalige ondersteuning (EN, NL, FR, DE, ES, IT)

Frontend voor eindgebruikers + adminpanel voor beheerders

2. Functionele Must-Haves
2.1 Features voor Eindgebruikers


Overzichtelijk dashboard met:

maand- en jaaruitgaven

categorieën

trends

Waarschuwingen voor:

opzegtermijnen

aankomende verlengingen

prijsverhogingen

Slimme categorisatie (AI of rule-based).

Contractbeheer (startdatum, einddatum, opzegtermijn).

Opzegassistent (handmatig of API-based).

Budget- en kostenanalyse + AI-inzichten.

Multi-currency ondersteuning.

3. Authenticatie & Accountbeheer (Supabase)
3.1 OAuth & Auth

Supabase Auth + OAuth via:

Google

Apple

Microsoft

GitHub

(Optioneel) e-mail magic link

3.2 Rollen & Toegang

end_user
Standaard gebruiker, ziet alleen eigen gegevens.

support
Kan gebruikers helpen, beperkte admininzage.

admin
Volledige CRUD over platformdata.

super_admin
Alleen voor platformbeheer (jij).

3.3 Security

Row-Level Security (RLS) regels per tabel.

Refresh tokens en sessiebeheer.

IP logging (optioneel).

Audit logging van belangrijke wijzigingen.

4. Supabase als Database & Backend
4.1 Database Componenten

Tabellen (indicatie):

Tabel	Functie
users	Gebruikersprofielen & instellingen
subscriptions	Abonnementen van gebruikers
products	Catalogus van abonnementstypen
plans	Varianten per product (bijv. Basic/Pro)
prices	Huidige prijzen
price_history	Historiek van prijswijzigingen
categories	Hoofdcategorieën en subcategorieën
translations	Tekststrings in alle talen
audit_logs	Alle gevoelige wijzigingen
settings	Platformbrede configuratie
4.2 Realtime & Business Logic

Supabase Realtime voor live synchronisatie.

Edge Functions voor:

abonnement-import

prijscheck routines

automatische meldingen

cron-based taken

5. Backend & Adminomgeving

De backend moet een volledige beheeromgeving ondersteunen waarin alle platformdata beheerd kan worden.

5.1 User Management (Admin)

Zoeken/filteren op e-mail, status, land, taal.

User detailpagina:

algemeen profiel

actieve / verlopen abonnementen

betaalhistorie (indien gekoppeld)

Statussen beheren (actief, geblokkeerd, proefperiode, etc.).

5.2 Subscription Management

Admins kunnen:

Subscriptions toevoegen, pausëren, opzeggen, verlengen.

Start/einddatums en opzegtermijn aanpassen.

Intervallen wijzigen (maand/jaar).

Koppelen aan product/plan in de catalogus.

5.3 Product & Catalogusbeheer

CRUD op producten (Netflix, Adobe, Spotify, etc.).

Productbeschrijvingen in alle talen.

Koppeling met categorieën.

Varianten aanmaken (bijv. Basic, Premium, Family).

5.4 Prijsbeheer

Prijzen toevoegen en beheren (maand/jaar).

Kortingregels configureren.

Multi-currency ondersteuning.

Toekomstige prijswijzigingen plannen.

Prijshistoriek automatisch opslaan.

5.5 Platforminstellingen

Talen in- en uitschakelen.

Default taal instellen (Engels).

Vertaalbeheer (optioneel via GitHub Storage of Supabase Storage).

API-integraties beheren:

E-mail provider (Resend/Mailgun)

Payment provider


Feature flags voor experimenten.

6. Meertaligheid (i18n)
6.1 Ondersteunde Talen

Engels (hoofdtaal)

Nederlands

Frans

Duits

Spaans

Italiaans

6.2 Implementatie

i18n-framework zoals i18next, Lingui, of Next.js i18n.

Alle UI-strings vertaalbaar maken.

Fallbacks naar Engels als default.

Taalkeuze door gebruiker + automatische detectie.

Opslag van vertalingen:

in JSON-bestanden

of in Supabase translations tabel

7. Admin UI (Frontend)

Een aparte interface voor beheerders waarin je:

7.1 Overzichtsschermen

Dashboard met KPI’s:

actieve abonnementen

MRR

churn

top categorieën

Tabellen voor users, producten, abonnementen, prijzen, categorieën.

7.2 Detail- & Bewerkschermen

Forms voor alle database-entiteiten.

Meertalige tabbladen (EN/NL/FR/DE/ES/IT).

Inline validatie.

Logging zichtbaar bij elke wijziging.

8. Veiligheid & Privacy
8.1 Beveiliging

TLS 1.3 encryptie.

AES-256 opslag waar vereist.

RLS voor alle usergerelateerde tabellen.

Minimaal-privilège voor adminrollen.

8.2 Privacy

Data-export op verzoek (GDPR).

Verwijderopties voor accounts.

Geen onnodige data-opslag.

Transparante verwerking van gebruikersgegevens.

9. Uitbreidingen (optioneel)

Prijsvergelijkingen per product via externe API.

AI-analyse voor ongebruikte subscriptions.

Automatische e-mailrapporten (maandelijks overzicht).

AI-gestuurde bespaartips.

### Core Features
- **Authentication** (authentication)
- **Database** (database)
- **API Routes** (database)
- **Email Service** (email)
- **Payment Integration** (payments)
- **Analytics** (analytics)
- **Testing Setup** (automation)

### Tech Stack
**Frontend:** next
**Backend:** node
**Database:** supabase

---

## 💡 Discovery Interview Insights

The following requirements and preferences were gathered through an AI-powered discovery interview:

### 📝 Additional Details

**Q: What is the primary target user segment for this subscription management tool?**  
A: Individual consumers

### ⚡ Functionality

**Q: Which subscription types do you want to prioritize tracking?**  
A: Software/SaaS, Streaming services, Utilities, Memberships, Digital subscriptions, Physical product subscriptions

**Q: What specific AI capabilities do you envision for budget and cost analysis?**  
A: Insights, recommendations, and predictive features.

### 📝 Additional Details

**Q: Estimated initial target number of concurrent users?**  
A: 100

**Q: Which external payment/billing integrations are most important?**  
A: Stripe, PayPal

### 📝 Additional Details

**Q: What is the primary monetization model for this platform?**  
A: Freemium with paid tiers

*These insights should guide all implementation decisions and ensure the final product matches user expectations.*

---

## 🔧 Available MCP Servers

The following MCP servers are available for this project:

### Desktop Commander
**ID:** `desktop-commander`  
**Description:** Comprehensive file system operations, terminal access, and process management

**Capabilities:**
- File read/write/edit operations
- Directory management
- File search (content and names)
- Terminal command execution
- Process management
- Interactive REPL sessions
- Configuration management

**Use Cases:**
- Project file creation
- Code generation
- Build automation
- Local development tasks
- Script execution
- Data analysis with Python/Node
- File transformations

### GitHub MCP
**ID:** `github`  
**Description:** Complete GitHub repository management and collaboration

**Capabilities:**
- Repository creation and management
- File operations (CRUD)
- Branch management
- Pull request workflows
- Issue tracking
- Code search
- Release management
- Collaboration features

**Use Cases:**
- Repository initialization
- Code versioning
- Team collaboration
- CI/CD integration
- Project documentation
- Issue management
- Code review workflows

### Supabase MCP
**ID:** `supabase`  
**Description:** PostgreSQL database, authentication, storage, and backend services

**Capabilities:**
- Database schema management
- SQL query execution
- Migrations and versioning
- Real-time subscriptions
- Authentication management
- File storage
- Edge Functions deployment
- Performance monitoring
- Row-level security (RLS)

**Use Cases:**
- Full-stack applications
- Real-time apps
- User authentication
- Data persistence
- API backends
- File uploads
- Serverless functions



---

## 🤖 AI Agents

This project requires 8 specialized AI agents working together:

### 1. Managing Agent 🔴

**Role:** Project Orchestrator & Strategic Decision Maker

**Responsibilities:**
- Coordinate all agents and delegate tasks
- Make strategic architectural decisions
- Resolve conflicts between agents
- Track overall project progress
- Ensure code quality standards
- Manage project timeline and priorities
- Review and approve all major changes

**MCP Access:**
- `desktop-commander`
- `github`
- `supabase`

**Collaborates With:**
- frontend-agent
- backend-agent
- data-agent
- security-agent
- qa-agent
- documentation-agent
- devops-agent

### 2. Frontend Agent 🟠

**Role:** UI/UX Developer

**Responsibilities:**
- Build responsive user interfaces
- Implement component architecture
- Handle state management
- Optimize frontend performance
- Ensure accessibility standards
- Integrate with backend APIs
- Implement design systems

**MCP Access:**
- `desktop-commander`
- `github`
- `chrome-devtools`

**Collaborates With:**
- managing-agent
- backend-agent

### 3. Backend Agent 🟠

**Role:** API & Business Logic Developer

**Responsibilities:**
- Design and implement REST/GraphQL APIs
- Develop business logic and services
- Handle data validation and processing
- Implement authentication and authorization
- Optimize database queries
- Build scalable architecture
- Handle error management

**MCP Access:**
- `desktop-commander`
- `github`
- `supabase`

**Collaborates With:**
- managing-agent
- frontend-agent
- data-agent

### 4. Data Agent 🟠

**Role:** Database Architect & Data Engineer

**Responsibilities:**
- Design optimal database schemas
- Create and manage migrations
- Implement data seeding strategies
- Optimize query performance
- Handle data relationships
- Implement caching strategies
- Ensure data integrity

**MCP Access:**
- `desktop-commander`
- `github`
- `supabase`

**Collaborates With:**
- managing-agent
- backend-agent

### 5. Security Agent 🟠

**Role:** Security & Authentication Specialist

**Responsibilities:**
- Implement authentication flows
- Set up authorization rules
- Configure security policies (RLS, CORS)
- Handle sensitive data encryption
- Implement input validation
- Conduct security audits
- Manage API keys and secrets

**MCP Access:**
- `desktop-commander`
- `github`
- `supabase`

**Collaborates With:**
- managing-agent
- backend-agent

### 6. QA Agent 🟡

**Role:** Quality Assurance & Testing Specialist

**Responsibilities:**
- Write unit and integration tests
- Implement E2E test suites
- Perform code reviews
- Test edge cases and error scenarios
- Ensure code coverage standards
- Validate user flows
- Report and track bugs

**MCP Access:**
- `desktop-commander`
- `github`

**Collaborates With:**
- managing-agent

### 7. Documentation Agent 🟡

**Role:** Technical Writer & Documentation Specialist

**Responsibilities:**
- Write comprehensive README files
- Document API endpoints
- Create code comments and JSDoc
- Write setup and deployment guides
- Maintain changelog
- Create user documentation
- Document architecture decisions

**MCP Access:**
- `desktop-commander`
- `github`

**Collaborates With:**
- managing-agent

### 8. DevOps Agent 🟡

**Role:** Deployment & Infrastructure Engineer

**Responsibilities:**
- Set up CI/CD pipelines
- Configure deployment environments
- Implement monitoring and logging
- Manage infrastructure as code
- Optimize build processes
- Handle container orchestration
- Ensure deployment reliability

**MCP Access:**
- `desktop-commander`
- `github`

**Collaborates With:**
- managing-agent



---

## 📊 Task Breakdown

Total Tasks: 11  
Estimated Total Hours: 57

### Managing Agent

**task-1:** Initialize Project Structure  
Create project directories, initialize git, set up package.json  
*Estimated: 1h | Dependencies: None*

**task-2:** Configure Development Environment  
Set up TypeScript, ESLint, Prettier, and other dev tools  
*Estimated: 2h | Dependencies: task-1*

### Data Agent

**task-3:** Design Database Schema  
Define tables, relationships, and constraints  
*Estimated: 4h | Dependencies: task-2*

**task-4:** Implement Database Migrations  
Create migration files and seed data  
*Estimated: 3h | Dependencies: task-4*

### Backend Agent

**task-5:** Build API Endpoints  
Implement REST/GraphQL APIs with business logic  
*Estimated: 8h | Dependencies: task-5*

### Security Agent

**task-6:** Implement Authentication  
Set up user authentication and authorization  
*Estimated: 6h | Dependencies: task-6*

### Frontend Agent

**task-7:** Build UI Components  
Create reusable React components and pages  
*Estimated: 10h | Dependencies: task-2*

**task-8:** Integrate Frontend with Backend  
Connect UI to API endpoints and handle state  
*Estimated: 6h | Dependencies: task-8*

### QA Agent

**task-9:** Write Test Suites  
Implement unit, integration, and E2E tests  
*Estimated: 8h | Dependencies: task-8*

### Documentation Agent

**task-10:** Write Documentation  
Create README, API docs, and user guides  
*Estimated: 4h | Dependencies: None*

### DevOps Agent

**task-11:** Set Up CI/CD Pipeline  
Configure GitHub Actions and deployment  
*Estimated: 5h | Dependencies: task-10*



---

## 🤝 Collaboration Protocol

### Communication Channels
- Code comments for implementation details
- Git commit messages for change descriptions
- Pull request descriptions for feature explanations
- Documentation for architectural decisions

### Review Process
- All code must be reviewed by Managing Agent
- Backend changes reviewed by Security Agent
- Frontend changes tested by QA Agent
- Documentation reviewed by Documentation Agent
- No direct commits to main branch

### Conflict Resolution
- Managing Agent makes final decisions
- Technical debates resolved through proof-of-concept
- Performance concerns validated with benchmarks
- Security issues have highest priority

### Progress Tracking
- Daily status updates in commit messages
- Task completion logged in project board
- Blockers immediately escalated to Managing Agent
- Weekly progress summary by Managing Agent

---

## 🚀 Getting Started

**IMPORTANT INSTRUCTIONS FOR CLAUDE CODE:**

1. **Read this entire prompt carefully** before starting any work
2. **Managing Agent coordinates all activities** - defer to Managing Agent for decisions
3. **Each agent should**:
   - Focus on their assigned responsibilities
   - Use only their assigned MCP servers
   - Communicate through code comments and documentation
   - Request review from appropriate agents
4. **Follow the task breakdown order** unless Managing Agent decides otherwise
5. **Maintain code quality**:
   - Write clean, documented code
   - Follow TypeScript best practices
   - Include error handling
   - Write tests where applicable

### First Steps

```
[Managing Agent] START HERE:

1. Initialize project structure using desktop-commander
2. Set up Git repository and push to GitHub
3. Delegate tasks to appropriate agents according to the Task Breakdown
4. Monitor progress and coordinate between agents

Begin execution now!
```

---

**⚡ PROJECT GENERATION COMPLETE - START BUILDING! ⚡**