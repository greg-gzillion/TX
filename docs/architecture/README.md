# PhoenixPME TX architecture 
## Date: 2026-02-21

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
| `ARCHITECTURE-OVERVIEW.md` | Complete system architecture breakdown | 2026-02-21 |
| `BRIDGE_SECURITY.md` | Cross-chain bridge security architecture | 2026-02-15 |
| `ORACLE_DESIGN.md` | Delivery verification oracle system | 2026-02-15 |
| `SECURITY_PATTERNS.md` | Smart contract security best practices | 2026-02-18 |
| `README.md` | This file - folder guide | 2026-02-21 |

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
│ (Community Reserve Fund) │
├─────────────────────────────┤
│ Data Layer │
│ (PostgreSQL, Prisma) │
├─────────────────────────────┤
│ Blockchain Layer │
│ (Coreum Smart Contracts) │
└─────────────────────────────┘

text

---

## 🔗 KEY ARCHITECTURE DECISIONS

| Decision | Status | Documented In |
|----------|--------|---------------|
| Monorepo Structure | ✅ Implemented | `ARCHITECTURE-OVERVIEW.md` |
| Multi-wallet Support | ✅ Implemented | `ARCHITECTURE-OVERVIEW.md` |
| Modular Backend (MVC) | ✅ Implemented | `ARCHITECTURE-OVERVIEW.md` |
| Smart Contract Isolation | ✅ Implemented | `ARCHITECTURE-OVERVIEW.md` |
| Multi-Oracle Design | 📝 Planned | `ORACLE_DESIGN.md` |
| Bridge Security | 📝 Planned | `BRIDGE_SECURITY.md` |

---

## 📝 HOW TO ADD NEW ARCHITECTURE DOCS

1. **Create file with descriptive name**
   ```bash
   nano docs/architecture/your-file-name.md
Include standard header

markdown
# Document Title

**Document Status:** [Draft | Living Document | Final]  
**Last Updated:** YYYY-MM-DD  
**Owner:** [Name]  
**Review Cycle:** [Monthly | Quarterly | None]
Add to this README table

Link related documents

Commit and push

bash
git add docs/architecture/
git commit -m "docs: add [document-name] to architecture"
🔄 DOCUMENT MAINTENANCE
Review Cycle: Monthly (first week of each month)

Owner: Greg (@greg-gzillion) reviews all architecture docs

Updates: Any major architectural change requires ADR and doc update

Versioning: Major changes noted in changelog

📎 RELATED DOCUMENTATION
Technical Specification

Development Guide

Setup Instructions

📝 CHANGELOG
2026-02-21: Updated date, added new architecture documents, terminology update

2026-02-13: Initial architecture folder setup
