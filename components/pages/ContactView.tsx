'use client';

import React, { useState } from 'react';
import { Clock, Mail, Linkedin, ShieldCheck, ArrowRight, Phone, Calendar, Check } from 'lucide-react';
import { PageHero } from '@/components/sections/PageHero';
import { Section } from '@/components/sections/Section';
import { Window } from '@/components/sections/Window';
import sections from '@/components/sections/sections.module.css';
import inner from '@/components/sections/inner.module.css';
import { track } from '@/lib/analytics';

const CAL_URL = 'https://cal.com/enzo-monnier-qc1nqv/30min';

// Clé Web3Forms (publique, prévue pour le code côté client). Les demandes arrivent sur enzo@opusadvisor.fr.
// Tant qu'elle est vide, le formulaire renvoie proprement vers l'email.
const WEB3FORMS_ACCESS_KEY = '14bb79f3-5e45-4423-afcc-23b0cb155435';

type Status = 'idle' | 'sending' | 'ok' | 'error';

/**
 * Contact page: book the free pre-audit on the calendar, or send a short request in writing (sent
 * through Web3Forms; on failure the visitor is pointed to the email address), plus the direct ways in.
 */
export const ContactView: React.FC = () => {
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    // Filet : pas de clé configurée → on oriente vers l'email plutôt qu'un échec silencieux.
    if (!WEB3FORMS_ACCESS_KEY) {
      setStatus('error');
      return;
    }

    setStatus('sending');
    const formData = new FormData(form);
    formData.append('access_key', WEB3FORMS_ACCESS_KEY);
    formData.append('subject', 'Nouvelle demande de pré-audit — opusadvisor.fr');
    formData.append('from_name', 'Site Opus Advisor');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setStatus('ok');
        track('Formulaire de contact envoyé');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <main id="contenu" className="flex-grow">
      <PageHero
        titleId="contact-title"
        chips={[{ label: 'Pré-audit gratuit', icon: 'booking' }, { label: '30 min en visio' }]}
        title="On parle de votre boîte ?"
        lede={
          <>
            30 minutes en visio. Vous me montrez vos outils. J'identifie 3 points de friction et je vous montre en direct
            comment les régler. <strong className="font-semibold text-white">C'est gratuit et sans engagement.</strong>
          </>
        }
      />

      <Section tone="ground">
        <div className={inner.contactGrid}>
          <Window title="Réserver un créneau">
            <div className={inner.paneBody}>
              <h2 className={inner.paneTitle}>Choisissez votre horaire.</h2>
              <div className={inner.calendarFrame}>
                <iframe
                  src={CAL_URL}
                  title="Réserver un créneau de pré-audit avec Opus Advisor"
                  loading="lazy"
                  allow="camera; microphone; fullscreen; payment"
                />
              </div>
              <p className="mt-4">
                <a href={CAL_URL} target="_blank" rel="noopener noreferrer" className={sections.more}>
                  Ouvrir le calendrier dans un nouvel onglet
                  <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                </a>
              </p>
              <ul className={inner.facts}>
                <li>
                  <Clock size={15} aria-hidden="true" /> 30 min · Visio
                </li>
                <li>
                  <ShieldCheck size={15} aria-hidden="true" /> Annulation libre jusqu'à 2h avant
                </li>
                <li>
                  <Calendar size={15} aria-hidden="true" /> Plages dispo sous 5 jours
                </li>
              </ul>
            </div>
          </Window>

          <Window title="Ou par écrit">
            <div className={inner.paneBody}>
              <h2 className={inner.paneTitle}>Pas envie de bloquer un créneau tout de suite ?</h2>
              <p className={inner.paneText}>
                Dites-moi l'essentiel en 30 secondes. Je vous réponds sous 24h ouvrées avec un premier retour concret.
              </p>

              {status === 'ok' ? (
                <div className={inner.success} role="status">
                  <Check size={20} strokeWidth={2.6} aria-hidden="true" />
                  <div>
                    <b>C'est reçu.</b>
                    <p>Je vous réponds sous 24h ouvrées. En attendant, vous pouvez aussi réserver directement un créneau à gauche.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={inner.form}>
                  {/* Honeypot anti-spam (caché) */}
                  <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

                  <div>
                    <label htmlFor="metier">Votre secteur</label>
                    <select id="metier" name="Secteur" required defaultValue="" className={inner.field}>
                      <option value="" disabled>
                        Choisir…
                      </option>
                      <option>Organisme de formation</option>
                      <option>Conciergerie, location courte durée</option>
                      <option>Agence immobilière</option>
                      <option>BTP second œuvre</option>
                      <option>Autre</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="taille">Taille de l'équipe</label>
                    <select id="taille" name="Taille équipe" required defaultValue="" className={inner.field}>
                      <option value="" disabled>
                        Choisir…
                      </option>
                      <option>Moins de 8</option>
                      <option>8 à 25</option>
                      <option>26 à 60</option>
                      <option>Plus de 60</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="email">Votre email</label>
                    <input id="email" type="email" name="Email" required placeholder="vous@votreboite.fr" className={inner.field} />
                  </div>

                  <div>
                    <label htmlFor="message">Votre principale galère du moment</label>
                    <textarea
                      id="message"
                      name="Problème prioritaire"
                      rows={3}
                      required
                      placeholder="Ex : les devis traînent, les relances je les fais jamais à temps…"
                      className={inner.field}
                    />
                  </div>

                  {status === 'error' && (
                    <p className={inner.formError} role="alert">
                      L'envoi n'a pas pu se faire. Écrivez-moi directement à <a href="mailto:enzo@opusadvisor.fr">enzo@opusadvisor.fr</a>.
                    </p>
                  )}

                  <button type="submit" disabled={status === 'sending'} className={`${sections.button} disabled:opacity-60`}>
                    {status === 'sending' ? 'Envoi…' : 'Envoyer ma demande'}
                    {status !== 'sending' && <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />}
                  </button>
                  <p className={inner.formNote}>Vos coordonnées servent seulement à vous répondre.</p>
                </form>
              )}

              <div className={inner.direct}>
                <a href="mailto:enzo@opusadvisor.fr">
                  <Mail size={18} aria-hidden="true" />
                  enzo@opusadvisor.fr
                </a>
                <a href="tel:+33615756549">
                  <Phone size={18} aria-hidden="true" />
                  +33 6 15 75 65 49
                </a>
                <a href="https://www.linkedin.com/in/enzo-monnier/" target="_blank" rel="noopener noreferrer">
                  <Linkedin size={18} aria-hidden="true" />
                  Enzo Monnier
                </a>
              </div>

              <div className={inner.agenda}>
                <p>Ce qu'on fera au pré-audit</p>
                <ul className={inner.ticks}>
                  {[
                    'Tour rapide de vos outils actuels',
                    '3 points de friction identifiés en direct',
                    '1 automatisation montrée sur vos propres données',
                    'Sans engagement de votre part',
                  ].map((d) => (
                    <li key={d}>
                      <Check size={16} strokeWidth={2.6} aria-hidden="true" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Window>
        </div>
      </Section>
    </main>
  );
};
