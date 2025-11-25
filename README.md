# Subscription Manager Pro

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

## Project Information

- **Type:** saas
- **Complexity:** moderate
- **Estimated Duration:** 2-4 weeks
- **Team Size:** 3 AI Agents

## Features

- **Authentication** (authentication)
- **Database** (database)
- **API Routes** (database)
- **Email Service** (email)
- **Payment Integration** (payments)
- **Analytics** (analytics)
- **Testing Setup** (automation)

## Tech Stack

**Frontend:** next
**Backend:** node
**Database:** supabase

## Getting Started

1. **Open in Claude Code**
   ```bash
   cd subscription-manager-pro
   ```

2. **Review the project prompt**
   - Open `.claude/PROJECT_PROMPT.md`
   - Read agent definitions in `.claude/agents/`
   - Check MCP configuration in `.claude/mcp-config.json`

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start development**
   ```bash
   npm run dev
   ```

## Project Structure

```
subscription-manager-pro/
├── .claude/
│   ├── PROJECT_PROMPT.md    # Main project prompt for Claude Code
│   ├── agents/              # Individual agent definitions
│   └── mcp-config.json      # MCP server configuration
├── src/                     # Source code
├── docs/                    # Documentation
├── tests/                   # Test files
├── README.md
├── package.json
└── .gitignore
```

## AI Agents

This project uses 3 specialized AI agents:
- Managing Agent (coordinates all activities)
- Additional agents based on project requirements

See `.claude/agents/` for detailed agent definitions.

## Next Steps

1. Review and customize the generated prompt
2. Let Claude Code agents start building!
3. Monitor progress and provide feedback
4. Test and iterate

---

**Generated by Project Generator Pro**
**Date:** 2025-11-21T20:23:58.307Z
**Generated at:** https://project.n8naccess.xyz
