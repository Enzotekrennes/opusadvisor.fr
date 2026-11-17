# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Owners and managers of small French and French-speaking Swiss businesses, roughly 2 to 60 people, who are still on the ground themselves and do the paperwork in the evening. Confirmed audiences (2026-11-17): France and Suisse romande.

- Training organisations (organismes de formation): enrolments, agreements, attendance sheets, funding files (OPCO, CPF, France Travail), Qualiopi evidence.
- Real estate and short-let concierge companies, including Geneva property-management agencies (régies): bookings, cleaning schedules, owner statements and invoicing, agent follow-up.
- Construction finishing trades (BTP second œuvre: electricity, plumbing, HVAC, joinery, painting): quotes, progress invoices (situations de travaux), retention money, payment reminders, job-site follow-up. Often reached on a phone between two job sites.

Their job when they land on the site: decide whether this person can take the re-typing and chasing off their hands without making them change everything, and whether a 30-minute call is worth it.

## Product Purpose

Opus Advisor organises and automates the management of small businesses: what the team types twice by hand gets handled by the system. Depending on the starting point: automations on the existing software (Make, n8n), a central app that brings the tools together (Airtable or a custom tool), or the whole system built from A to Z. Then Opus stays to run and evolve the system (Gardien du système).

Success for the site: a qualified visitor books the free 30-minute pre-audit (video call on Enzo's own calendar) or calls.

## Positioning

A founder and former developer who both builds the system and stays to maintain it, independent of any software vendor (no commission on the tools recommended), with public prices. Software vendors sell their tool and move on; consultancies hand over a roadmap and leave. Opus builds the connections between tools and keeps them running.

## Operating Context

- Free pre-audit: 30 min video call, screen sharing, 3 friction points identified. Booking on Cal.com; phone 06 15 75 65 49 also offered.
- Offer ladder with public prices: pré-audit (free), diagnostic (2 500 €), mise en œuvre (from 5 500 €), gardien du système (400 to 1 500 €/month). Audit Stack (990 €, written review in 10 working days) is a standalone alternative, not a step.
- Free e-invoicing diagnostic online; 6 free BTP calculators under /outils/; articles per sector.
- Based in Vannes (Brittany); on site within about two hours, video everywhere else in France and Suisse romande.
- E-invoicing reform deadline for SMEs: 1 September 2027 (issuing).

## Capabilities and Constraints

- Existing Next.js static-export site (opusadvisor.fr), deployed from main; French only.
- Copy in French, vouvoiement, short sentences, concrete, no hype, no jargon.
- Never invent a figure, client, testimonial, study or quote; never name a client.
- 10 hours a week is an objective measured with the client, not a guarantee.
- Undecided: whether a dedicated Suisse romande page or pricing in CHF is needed.

## Brand Commitments

- Name: Opus Advisor (never "Opus Advisory").
- The current logo stays: `public/images/opus-logo-header.webp`, `public/images/opus-logo-white.webp`, `public/images/opus-icon.png`. Colours and typefaces are open in the redesign.

## Evidence on Hand

- Three real missions, unnamed (`lib/cases.ts`): a training-organisation network CRM (Next.js, Airtable; 10 modules, 3 240 tests, in production); a concierge company whose whole management system was taken over and has been maintained since September 2025; a real estate agents' follow-up tool built in subcontracting.
- Animated, simplified visuals of those cases (`components/motion/CaseVisual`) and a hero demo of automated flows per sector (`components/motion/AutomationDemo`), labelled as examples.
- Founder portrait: `public/images/enzo.jpg`. Team page presents Enzo Monnier (founder, former developer) and Gwendoline (associée, in support); Opus is Enzo's company.
- No published BTP client case: a 3-place BTP pilot programme is published instead (/cas-clients/#programme-pilote). No testimonials, no result figures (hours or euros) for clients. Do not fabricate any of these.

## Product Principles

1. Show the real mechanism (the re-typing that disappears) before asking for anything.
2. Every claim is something Opus can prove or label as an example.
3. One way in: the free pre-audit, with a person the visitor can see and call.
4. Speak each trade's own words: funding files, owner statements, progress invoices.
5. Stay modest about results; be precise about method and prices.
