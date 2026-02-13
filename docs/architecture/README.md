
# PhoenixPME TX architecture 
## Date: 2026-02-13

# Architecture Documentation
## Location: `/docs/architecture/`

This folder contains system architecture documents for the PhoenixPME platform.

## 📋 PURPOSE OF THIS FOLDER

The `architecture/` directory houses all documentation related to:
- **System design** - High-level architecture decisions
- **Component relationships** - How modules interact
- **Data flow diagrams** - Information movement
- **Technical specifications** - Implementation details
- **Architecture Decision Records (ADRs)** - Key technical choices

---

## 📚 DOCUMENTS IN THIS FOLDER

| Document | Purpose | Last Updated |
|----------|---------|--------------|
| `ARCHITECTURE-OVERVIEW.md` | Complete system architecture breakdown | 2026-02-13 |
| `README.md` | This file - folder guide | 2026-02-13 |

---

## 🏗️ WHAT BELONGS HERE

### ✅ **Do place these in this folder:**
- System architecture diagrams
- Component interaction models
- Database schema designs
- API architecture decisions
- Security architecture
- Deployment architecture
- Scalability plans
- Technology stack decisions

### ❌ **Do NOT place these here:**
- User guides → `/docs/guides/`
- Setup instructions → `/docs/setup/`
- Business documents → `/docs/business/`
- Legal agreements → `/docs/legal/`
- Development guides → `/docs/development/`
- Test files → `/docs/test-files/`

---

## 📊 ARCHITECTURE LAYERS
┌─────────────────────────────┐
│ Presentation Layer │
│ (Frontend - Next.js) │
├─────────────────────────────┤
│ Application Layer │
│ (Backend - Express) │
├─────────────────────────────┤
│ Service Layer │
│ (Insurance Module, etc) │
├─────────────────────────────┤
│ Data Layer │
│ (PostgreSQL, Prisma) │
├─────────────────────────────┤
│ Blockchain Layer │
│ (Coreum Smart Contracts) │
└─────────────────────────────┘


---

## 🔗 KEY ARCHITECTURE DECISIONS

| Decision | Status | Documented In |
|----------|--------|---------------|
| Monorepo Structure | ✅ Implemented | `ARCHITECTURE-OVERVIEW.md` |
| Multi-wallet Support | ✅ Implemented | `ARCHITECTURE-OVERVIEW.md` |
| Modular Backend (MVC) | ✅ Implemented | `ARCHITECTURE-OVERVIEW.md` |
| Smart Contract Isolation | ✅ Implemented | `ARCHITECTURE-OVERVIEW.md` |

---

## 📝 HOW TO ADD NEW ARCHITECTURE DOCS

1. **Create file with descriptive name**
   ```bash
   nano docs/architecture/your-file-name.md

