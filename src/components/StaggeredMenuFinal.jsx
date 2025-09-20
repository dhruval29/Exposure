import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './StaggeredMenuFinal.css';
import instagramIcon from '../assets/instagram-svgrepo-com.svg';
import youtubeIcon from '../assets/youtube-svgrepo-com.svg';
import linkedinIcon from '../assets/linkedin-svgrepo-com.svg';

const DEFAULT_COLORS = ['#fecaca', '#fde68a'];

const StaggeredMenuFinal = ({
  position = 'right',
  colors = DEFAULT_COLORS,
  items = [],
  displaySocials = true,
  displayItemNumbering = true,
  className,
  logoUrl,
  menuButtonColor = '#fff',
  openMenuButtonColor = '#fff',
  accentColor = '#5227FF',
  changeMenuColorOnOpen = true,
  onMenuOpen,
  onMenuClose
}) => {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const panelRef = useRef(null);
  const preLayersRef = useRef(null);
  const preLayerElsRef = useRef([]);
  const plusHRef = useRef(null);
  const plusVRef = useRef(null);
  const iconRef = useRef(null);
  const textInnerRef = useRef(null);
  const toggleBtnRef = useRef(null);
  const openTlRef = useRef(null);
  const closeTweenRef = useRef(null);
  const spinTweenRef = useRef(null);
  const colorTweenRef = useRef(null);
  const textCycleAnimRef = useRef(null);
  const busyRef = useRef(false);

  const [textLines, setTextLines] = useState(['Menu']);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;
      const plusH = plusHRef.current;
      const plusV = plusVRef.current;
      const icon = iconRef.current;
      const textInner = textInnerRef.current;
      if (!panel || !plusH || !plusV || !icon || !textInner) return;

      const preLayers = preContainer ? Array.from(preContainer.querySelectorAll('.smf-prelayer')) : [];
      preLayerElsRef.current = preLayers;

      const offscreen = position === 'left' ? -100 : 100;
      gsap.set([panel, ...preLayers], { xPercent: offscreen });
      gsap.set(plusH, { transformOrigin: '50% 50%', rotate: 0 });
      gsap.set(plusV, { transformOrigin: '50% 50%', rotate: 90 });
      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });
      gsap.set(textInner, { yPercent: 0 });
      if (toggleBtnRef.current) gsap.set(toggleBtnRef.current, { color: menuButtonColor });
    });
    return () => ctx.revert();
  }, [menuButtonColor, position]);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }

    const itemEls = Array.from(panel.querySelectorAll('.smf-itemLabel'));
    const numberEls = Array.from(panel.querySelectorAll('.smf-list[data-numbering] .smf-item'));
    const socialLinks = Array.from(panel.querySelectorAll('.smf-socials-link'));

    const layerStates = layers.map(el => ({ el, start: Number(gsap.getProperty(el, 'xPercent')) }));
    const panelStart = Number(gsap.getProperty(panel, 'xPercent'));

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    if (numberEls.length) gsap.set(numberEls, { '--smf-num-opacity': 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    layerStates.forEach((ls, i) => {
      tl.fromTo(ls.el, { xPercent: ls.start }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07);
    });
    const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
    const panelDuration = 0.65;
    tl.fromTo(panel, { xPercent: panelStart }, { xPercent: 0, duration: panelDuration, ease: 'power4.out' }, panelInsertTime);

    if (itemEls.length) {
      const itemsStart = panelInsertTime + panelDuration * 0.15;
      tl.to(
        itemEls,
        {
          yPercent: 0,
          rotate: 0,
          duration: 1,
          ease: 'power4.out',
          stagger: { each: 0.1, from: 'start' }
        },
        itemsStart
      );
      if (numberEls.length) {
        tl.to(
          numberEls,
          {
            duration: 0.6,
            ease: 'power2.out',
            '--smf-num-opacity': 1,
            stagger: { each: 0.08, from: 'start' }
          },
          itemsStart + 0.1
        );
      }
    }

    if (socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4;
      tl.to(
        socialLinks,
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          ease: 'power3.out',
          stagger: { each: 0.08, from: 'start' },
          onComplete: () => gsap.set(socialLinks, { clearProps: 'opacity' })
        },
        socialsStart + 0.04
      );
    }

    openTlRef.current = tl;
    return tl;
  }, []);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback('onComplete', () => {
        busyRef.current = false;
      });
      tl.play(0);
    } else {
      busyRef.current = false;
    }
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;

    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    const all = [...layers, panel];
    closeTweenRef.current?.kill();
    const offscreen = position === 'left' ? -100 : 100;
    closeTweenRef.current = gsap.to(all, {
      xPercent: offscreen,
      duration: 0.32,
      ease: 'power3.in',
      overwrite: 'auto',
      onComplete: () => {
        const itemEls = Array.from(panel.querySelectorAll('.smf-itemLabel'));
        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
        const numberEls = Array.from(panel.querySelectorAll('.smf-list[data-numbering] .smf-item'));
        if (numberEls.length) gsap.set(numberEls, { '--smf-num-opacity': 0 });
        const socialLinks = Array.from(panel.querySelectorAll('.smf-socials-link'));
        if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });
        busyRef.current = false;
      }
    });
  }, [position]);

  const animateIcon = useCallback(opening => {
    const icon = iconRef.current;
    if (!icon) return;
    spinTweenRef.current?.kill();
    if (opening) {
      spinTweenRef.current = gsap.to(icon, { rotate: 225, duration: 0.8, ease: 'power4.out', overwrite: 'auto' });
    } else {
      spinTweenRef.current = gsap.to(icon, { rotate: 0, duration: 0.35, ease: 'power3.inOut', overwrite: 'auto' });
    }
  }, []);

  const animateColor = useCallback(
    opening => {
      const btn = toggleBtnRef.current;
      if (!btn) return;
      colorTweenRef.current?.kill();
      if (changeMenuColorOnOpen) {
        const targetColor = opening ? openMenuButtonColor : menuButtonColor;
        colorTweenRef.current = gsap.to(btn, { color: targetColor, delay: 0.18, duration: 0.3, ease: 'power2.out' });
      } else {
        gsap.set(btn, { color: menuButtonColor });
      }
    },
    [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen]
  );

  React.useEffect(() => {
    if (toggleBtnRef.current) {
      if (changeMenuColorOnOpen) {
        const targetColor = openRef.current ? openMenuButtonColor : menuButtonColor;
        gsap.set(toggleBtnRef.current, { color: targetColor });
      } else {
        gsap.set(toggleBtnRef.current, { color: menuButtonColor });
      }
    }
  }, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor]);

  const animateText = useCallback(opening => {
    const inner = textInnerRef.current;
    if (!inner) return;
    textCycleAnimRef.current?.kill();

    // Only animate when closing to show "Menu" text
    if (!opening) {
      setTextLines(['Menu']);
      gsap.set(inner, { yPercent: 0 });
      // No animation needed since we only have one text line
    }
  }, []);

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);
    if (target) {
      onMenuOpen?.();
      playOpen();
    } else {
      onMenuClose?.();
      playClose();
    }
    animateIcon(target);
    animateColor(target);
    animateText(target);
  }, [playOpen, playClose, animateIcon, animateColor, animateText, onMenuOpen, onMenuClose]);

  const closeMenu = useCallback(() => {
    if (!openRef.current) return;
    openRef.current = false;
    setOpen(false);
    onMenuClose?.();
    playClose();
    animateIcon(false);
    animateColor(false);
    animateText(false);
  }, [onMenuClose, playClose, animateIcon, animateColor, animateText]);

  const menuItems = Array.isArray(items) ? items : [];
  const safeLogo = logoUrl || '/assets/icons/new-arrow.svg';

  return (
    <div
      className={(className ? className + ' ' : '') + 'smf-wrapper'}
      style={accentColor ? { ['--smf-accent']: accentColor } : undefined}
      data-position={position}
      data-open={open || undefined}
    >
      <div className="smf-overlay" onClick={closeMenu} aria-hidden={!open} />
      <div ref={preLayersRef} className="smf-prelayers" aria-hidden="true">
        {(colors && colors.length ? colors.slice(0, 4) : DEFAULT_COLORS).map((c, i) => (
          <div key={i} className="smf-prelayer" style={{ background: c }} />
        ))}
      </div>
      <header className="smf-header" aria-label="Main navigation header">
        <button
          ref={toggleBtnRef}
          className="smf-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="smf-panel"
          onClick={toggleMenu}
          type="button"
        >
          <span className="smf-toggle-textWrap" aria-hidden="true">
            <span ref={textInnerRef} className="smf-toggle-textInner">
              {textLines.map((l, i) => (
                <span className="smf-toggle-line" key={i}>{l}</span>
              ))}
            </span>
          </span>
          <span ref={iconRef} className="smf-icon" aria-hidden="true">
            <span ref={plusHRef} className="smf-icon-line" />
            <span ref={plusVRef} className="smf-icon-line smf-icon-line-v" />
          </span>
        </button>
      </header>

      <aside id="smf-panel" ref={panelRef} className="smf-panel" aria-hidden={!open}>
        <div className="smf-panel-inner">
          <ul className="smf-list" role="list" data-numbering={displayItemNumbering || undefined}>
            {menuItems.length ? (
              menuItems.map((it, idx) => (
                <li className="smf-itemWrap" key={(it.label || 'item') + idx}>
                  {it.link ? (
                    <a className="smf-item" href={it.link} aria-label={it.ariaLabel} data-index={idx + 1}>
                      <span className="smf-itemLabel">{it.label || 'Item'}</span>
                    </a>
                  ) : (
                    <span className="smf-item" data-index={idx + 1}>
                      <span className="smf-itemLabel">{it.label || 'Item'}</span>
                    </span>
                  )}
                </li>
              ))
            ) : (
              <li className="smf-itemWrap" aria-hidden="true">
                <span className="smf-item">
                  <span className="smf-itemLabel">No items</span>
                </span>
              </li>
            )}
          </ul>

          {displaySocials && (
            <div className="smf-socials" aria-label="Social links">
              <div className="smf-socials-icons">
                <a 
                  href="https://www.instagram.com/exposure.explorers_nitg/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="smf-socials-link"
                  aria-label="Instagram"
                >
                  <img src={instagramIcon} alt="Instagram" className="smf-socials-icon" />
                </a>
                <a 
                  href="https://www.linkedin.com/company/exposure-explorers/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="smf-socials-link"
                  aria-label="LinkedIn"
                >
                  <img src={linkedinIcon} alt="LinkedIn" className="smf-socials-icon" />
                </a>
                <a 
                  href="https://www.youtube.com/@Exposure-Explorers" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="smf-socials-link"
                  aria-label="YouTube"
                >
                  <img src={youtubeIcon} alt="YouTube" className="smf-socials-icon" />
                </a>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default StaggeredMenuFinal;


