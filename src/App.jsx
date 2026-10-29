import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, CirclePlay,
  Clock3, GraduationCap, Instagram, MapPin, Menu, MessageCircle, Pause, Phone,
  Quote, ShieldCheck, Star, Volume2, VolumeX, X,
} from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { config } from './config'

const pageMeta = {
  home: {
    title: 'The Bansal Academy | Best Coaching in Laxmi Nagar, Delhi (Class 9-12, Commerce, Arts)',
    description: 'Concept-focused coaching in Laxmi Nagar, Delhi for Class 9 to 12 Maths, Science, Commerce and Arts. Rated 4.9 on Google by 204 reviews. Book a free demo.',
  },
  founder: { title: 'Meet Naman Bansal, Founder | The Bansal Academy', description: 'Meet Naman Bansal, founder of The Bansal Academy. Read about his teaching journey, educational vision and concept-focused approach to learning.' },
  privacy: { title: 'Privacy Policy | The Bansal Academy', description: 'How The Bansal Academy handles enquiry information and privacy.' },
  terms: { title: 'Terms of Use | The Bansal Academy', description: 'Terms for using The Bansal Academy website.' },
  thanks: { title: 'Thank you | The Bansal Academy', description: 'Thank you for contacting The Bansal Academy.' },
  notFound: { title: 'Page not found | The Bansal Academy', description: 'The page you are looking for could not be found.' },
}

function Seo({ page = 'home', noindex = false }) {
  const meta = pageMeta[page] ?? pageMeta.home
  const url = config.siteUrl ? new URL(window.location.pathname, config.siteUrl).href : ''
  const image = config.siteUrl ? new URL('/og-image.png', config.siteUrl).href : '/og-image.png'
  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      {page === 'home' && <meta name="keywords" content={config.seoKeywords.join(', ')} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {url && <link rel="canonical" href={url} />}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="The Bansal Academy logo on a blue background" />
      {url && <meta property="og:url" content={url} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  )
}

function Logo({ light = false }) {
  return (
    <Link to="/" className={`brand ${light ? 'brand-light' : ''}`} aria-label={`${config.name} home`}>
      <img className="brand-logo" src="/logo.png" alt={config.name} />
    </Link>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  useEffect(() => setOpen(false), [location])
  const links = [
    ['Founder', '/founder'], ['Classes', '/#classes'], ['Gallery', '/#gallery'], ['Reels', '/#reels'],
    ['Reviews', '/#reviews'], ['Contact', '/#contact'],
  ]
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <div className="header-inner wrap">
          <Logo />
          <nav className={`main-nav ${open ? 'nav-open' : ''}`} aria-label="Main navigation">
            {links.map(([label, href]) => <Link key={label} to={href} onClick={() => setOpen(false)}>{label}</Link>)}
            <Link className="button button-primary nav-cta" to="/#contact" onClick={() => setOpen(false)}>Enquire now <ArrowUpRight size={16} /></Link>
          </nav>
          <button className="icon-button mobile-menu" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>
    </>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div>
          <Logo light />
          <p className="footer-about">{config.about}</p>
        </div>
        <div><h3>Explore</h3><Link to="/founder">Founder</Link><a href="/#classes">Classes</a><a href="/#gallery">Gallery</a><a href="/#reviews">Reviews</a><a href="/#contact">Contact</a></div>
        <div><h3>Get in touch</h3><a href={config.phoneLink}>{config.phone}</a><a href={config.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a><a href={config.instagram} target="_blank" rel="noopener noreferrer">Instagram</a><a href={config.facebook} target="_blank" rel="noopener noreferrer">Facebook</a></div>
        <div><h3>Information</h3><Link to="/privacy-policy">Privacy policy</Link><Link to="/terms">Terms of use</Link><a href={config.google} target="_blank" rel="noopener noreferrer">Google profile</a></div>
      </div>
      <div className="wrap footer-bottom"><span>© {config.name}</span><span>Made for curious minds.</span></div>
    </footer>
  )
}

function MobileBar() {
  return (
    <div className="mobile-bar" aria-label="Quick contact">
      <a href={config.phoneLink}><Phone size={17} /> Call</a>
      <a href={config.whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} /> WhatsApp</a>
      <a href="/#contact"><ArrowUpRight size={17} /> Enquire</a>
    </div>
  )
}

function ReelCard({ reel, index }) {
  const videoRef = useRef(null)
  const frameRef = useRef(null)
  const [available, setAvailable] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    const frame = frameRef.current
    if (!video || !frame) return undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (available) {
          video.muted = muted
          video.play().then(() => setPlaying(true)).catch(() => {
            if (!muted) {
              video.muted = true
              setMuted(true)
              video.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
              return
            }
            setPlaying(false)
          })
        }
      } else {
        video.pause()
        setPlaying(false)
      }
    }, { threshold: 0.45 })
    observer.observe(frame)
    return () => observer.disconnect()
  }, [available, muted])

  const togglePlay = () => {
    if (!available) {
      window.open(reel.url, '_blank', 'noopener,noreferrer')
      return
    }
    const video = videoRef.current
    if (video.paused) video.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    else { video.pause(); setPlaying(false) }
  }
  const toggleMute = () => {
    const nextMuted = !muted
    const video = videoRef.current
    video.muted = nextMuted
    setMuted(nextMuted)
    if (!nextMuted) {
      video.play().then(() => setPlaying(true)).catch(() => {
        video.muted = true
        setMuted(true)
        setPlaying(false)
      })
    }
  }
  return (
    <article className="reel-card">
      <div className="phone-frame" ref={frameRef}>
        <video ref={videoRef} className={`reel-video ${available ? '' : 'video-missing'}`} src={reel.video} poster={reel.poster} muted={muted} loop playsInline preload="metadata" aria-label={`The Bansal Academy coaching in Laxmi Nagar reel ${index + 1}`} onCanPlay={() => setAvailable(true)} onError={() => setAvailable(false)} />
        {!available && <div className="reel-fallback"><img src={reel.poster} alt={`Preview frame for The Bansal Academy coaching in Laxmi Nagar reel ${index + 1}`} /><span>Video not available · tap to watch on Instagram</span></div>}
        {(!available || !playing) && <button className="video-play" onClick={togglePlay} aria-label={!available ? 'Watch reel on Instagram' : 'Play reel'}>
          <CirclePlay size={35} strokeWidth={1.5} />
        </button>}
        {playing && <button className="video-play video-pause" onClick={togglePlay} aria-label="Pause reel">
          <Pause size={28} strokeWidth={1.8} />
        </button>}
        {available && <button className="video-audio" onClick={toggleMute} aria-label={muted ? 'Turn video sound on' : 'Mute video'} title={muted ? 'Tap for sound' : 'Mute sound'}>{muted ? <VolumeX size={18} /> : <Volume2 size={18} />}{muted && <span className="video-audio-hint">Sound off · tap for sound</span>}</button>}
      </div>
      <a href={reel.url} className="reel-link" target="_blank" rel="noopener noreferrer">Watch on Instagram <ArrowUpRight size={16} /></a>
    </article>
  )
}

function Reels() {
  return (
    <section className="section reels-section" id="reels">
      <div className="wrap">
        <div className="section-heading centered">
          <span className="eyebrow"><Instagram size={15} /> A glimpse inside</span>
          <h2>Small moments.<br /><em>Big understanding.</em></h2>
          <p>See what learning looks like at The Bansal Academy.</p>
        </div>
        <div className="reel-grid">{config.instagramReels.map((reel, i) => <ReelCard reel={reel} index={i} key={reel.video} />)}</div>
        <div className="center follow-wrap"><a className="button button-outline" href={config.instagram} target="_blank" rel="noopener noreferrer"><Instagram size={17} /> Follow @thebansalacademy <ArrowUpRight size={15} /></a></div>
      </div>
    </section>
  )
}

function Classes({ onSelect }) {
  const [filter, setFilter] = useState('All')
  const categories = ['All', 'School', 'Commerce', 'Arts', 'CUET']
  const courseCategories = {
    juniors: 'SCHOOL',
    'class-9': 'SCHOOL',
    'class-10': 'SCHOOL',
    'class-11-12-commerce': 'COMMERCE',
    'class-11-12-arts': 'ARTS',
    cuet: 'ENTRANCE EXAM',
  }
  const courseDescriptions = {
    juniors: 'Supportive all-subject coaching for Classes 1 to 8, building strong foundations and confident study habits.',
    'class-9': 'Build strong foundations in Maths, Science and Social Science through concept-focused teaching.',
    'class-10': 'Prepare for Class 10 with focused support in Maths, Science and Social Science.',
    'class-11-12-commerce': 'Strengthen your understanding of Accountancy, Economics and Business Studies.',
    'class-11-12-arts': 'Explore Political Science, Sociology and Economics with clear, guided teaching.',
    cuet: 'Contact the academy to learn more about current CUET preparation options.',
  }
  const visible = config.courses.filter((course) => {
    if (filter === 'All') return true
    if (filter === 'School') return course.id === 'juniors' || course.id === 'class-9' || course.id === 'class-10'
    if (filter === 'Commerce') return course.id === 'class-11-12-commerce'
    if (filter === 'Arts') return course.id === 'class-11-12-arts'
    return course.id === 'cuet'
  })
  return (
    <section className="section classes-section" id="classes" aria-labelledby="classes-heading">
      <div className="wrap">
        <div className="section-heading classes-heading">
          <span className="eyebrow"><span className="classes-eyebrow-mark" aria-hidden="true" />Find your focus</span>
          <h2 id="classes-heading">Find the Right Course <span>for Your Future</span></h2>
          <p>Explore expert coaching for school subjects, Commerce, Arts and CUET preparation in Laxmi Nagar.</p>
        </div>
        <div className="filter-tabs" role="tablist" aria-label="Filter classes">
          {categories.map((name) => <button key={name} className={filter === name ? 'active' : ''} onClick={() => setFilter(name)} role="tab" aria-selected={filter === name}>{name}</button>)}
        </div>
        <div className="course-list" id="classes-course-list">
          {visible.map((course) => {
            return (
              <article className={`course-row course-card course-card-${course.id}`} key={course.id}>
                <div className="course-card-content">
                  <span className="course-category">{courseCategories[course.id]}</span>
                  <h3>{course.label}</h3>
                  <p className="course-subjects">{course.subjects}</p>
                  <p className="course-card-description">{courseDescriptions[course.id]}</p>
                  {(course.timing || course.mode || course.fee) && <div className="course-meta">
                    {course.timing && <span><Clock3 size={15} />{course.timing}</span>}
                    {course.mode && <span>{course.mode}</span>}
                    {course.fee && <span>{course.fee}</span>}
                  </div>}
                  <button className="button button-outline course-enquire" onClick={() => onSelect(course.label)}>Enquire Now <ArrowUpRight size={16} /></button>
                </div>
              </article>
            )
          })}
        </div>
        <p className="course-note">Class timings and learning modes are shared directly on enquiry.</p>
      </div>
    </section>
  )
}

function PhotoGallery() {
  const [activeIndex, setActiveIndex] = useState(null)
  const gallery = config.gallery
  const reducedMotion = useReducedMotion()
  const isLightboxOpen = activeIndex !== null
  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)
  const returnFocusRef = useRef(null)
  const touchStartX = useRef(null)
  const currentPhoto = activeIndex === null ? null : gallery[activeIndex]

  const openPhoto = (index) => {
    returnFocusRef.current = document.activeElement
    setActiveIndex(index)
  }
  const closePhoto = () => setActiveIndex(null)
  const showPrevious = () => setActiveIndex((index) => (index + gallery.length - 1) % gallery.length)
  const showNext = () => setActiveIndex((index) => (index + 1) % gallery.length)

  useEffect(() => {
    if (!isLightboxOpen) return undefined
    const bodyOverflow = document.body.style.overflow
    const documentOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setActiveIndex(null)
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        setActiveIndex((index) => (index + gallery.length - 1) % gallery.length)
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        setActiveIndex((index) => (index + 1) % gallery.length)
      } else if (event.key === 'Tab' && dialogRef.current) {
        const focusable = [...dialogRef.current.querySelectorAll('button:not([disabled])')]
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = bodyOverflow
      document.documentElement.style.overflow = documentOverflow
      returnFocusRef.current?.focus()
    }
  }, [isLightboxOpen, gallery.length])

  return (
    <section className="section academy-gallery-section" id="gallery" aria-labelledby="gallery-heading">
      <div className="wrap">
        <div className="section-heading centered">
          <span className="eyebrow">A glimpse inside</span>
          <h2 id="gallery-heading">Life at The Bansal Academy</h2>
          <p>A look at our classrooms, teaching and celebrations in Laxmi Nagar.</p>
        </div>
        <div className="academy-gallery-grid">
          {gallery.map((photo, index) => {
            const isWide = index === 0 || index === 5 || index === 8
            const sizes = isWide
              ? '(min-width: 1208px) 572px, (min-width: 901px) calc(50vw - 32px), (min-width: 761px) 475px, (min-width: 681px) calc(66.67vw - 32px), calc(100vw - 40px)'
              : '(min-width: 1208px) 278px, (min-width: 901px) calc(25vw - 24px), (min-width: 761px) 229px, (min-width: 681px) calc(33.33vw - 24px), calc(50vw - 29px)'
            return (
              <motion.button
                className="academy-gallery-card"
                type="button"
                key={photo.src}
                onClick={() => openPhoto(index)}
                aria-label={`Open photo ${index + 1} of ${gallery.length}: ${photo.caption}`}
                initial={reducedMotion ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ duration: reducedMotion ? 0 : 0.4, delay: reducedMotion ? 0 : (index % 4) * 0.055 }}
              >
                <span className="academy-gallery-image-frame">
                  <img
                    src={photo.src}
                    srcSet={photo.srcSet}
                    sizes={sizes}
                    width={photo.width}
                    height={photo.height}
                    style={{ objectPosition: photo.objectPosition }}
                    alt={photo.alt}
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <span className="academy-gallery-caption">{photo.caption}</span>
              </motion.button>
            )
          })}
        </div>
        <div className="center academy-gallery-more">
          <a className="button button-outline" href={config.instagram} target="_blank" rel="noopener noreferrer">
            <Instagram size={17} /> See more on Instagram <ArrowUpRight size={15} />
          </a>
        </div>
      </div>
      {currentPhoto && (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Academy photo gallery"
          ref={dialogRef}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closePhoto()
          }}
          onTouchStart={(event) => { touchStartX.current = event.changedTouches[0].clientX }}
          onTouchEnd={(event) => {
            if (touchStartX.current === null) return
            const distance = event.changedTouches[0].clientX - touchStartX.current
            if (Math.abs(distance) > 50) (distance > 0 ? showPrevious : showNext)()
            touchStartX.current = null
          }}
        >
          <button className="gallery-lightbox-close" type="button" onClick={closePhoto} ref={closeButtonRef} aria-label="Close gallery">
            <X size={24} />
          </button>
          <button className="gallery-lightbox-arrow gallery-lightbox-prev" type="button" onClick={showPrevious} aria-label="Previous photo">
            <ArrowLeft size={22} />
          </button>
          <figure className="gallery-lightbox-figure">
            <img src={currentPhoto.lightboxSrc} width={currentPhoto.lightboxWidth ?? currentPhoto.width} height={currentPhoto.lightboxHeight ?? currentPhoto.height} alt={currentPhoto.alt} decoding="async" />
            <figcaption>{currentPhoto.caption}</figcaption>
          </figure>
          <button className="gallery-lightbox-arrow gallery-lightbox-next" type="button" onClick={showNext} aria-label="Next photo">
            <ArrowRight size={22} />
          </button>
          <span className="gallery-lightbox-counter" aria-live="polite">{activeIndex + 1} / {gallery.length}</span>
        </div>
      )}
    </section>
  )
}

function ReviewCard({ review, hidden = false }) {
  return (
    <article className="review-card" aria-hidden={hidden || undefined}>
      <div className="review-top"><span className="review-stars" aria-label="5 out of 5 stars">{Array.from({ length: 5 }, (_, i) => <Star key={i} size={15} fill="currentColor" />)}</span><span className="google-g" aria-label="Google">G</span></div>
      <p>“{review.text}”</p>
      {review.name && <span className="review-name">{review.name}</span>}
    </article>
  )
}

function Reviews() {
  const reducedMotion = useReducedMotion()
  const [touching, setTouching] = useState(false)
  const reviews = config.reviews
  const loopReviews = [...reviews, ...reviews, ...reviews]
  return (
    <section className="section reviews-section" id="reviews">
      <div className="wrap">
        <div className="reviews-heading">
          <div><span className="eyebrow"><Star size={15} fill="currentColor" /> Kind words from our community</span><h2>Why students choose The Bansal Academy</h2></div>
          <div className="rating-block"><div className="rating-number">{config.rating.toFixed(1)}<span>/5</span></div><div><div className="rating-stars" aria-label={`${config.rating} on Google`}>★★★★★</div><p>{config.reviewCount} Google reviews</p></div><a className="button button-outline" href={config.google} target="_blank" rel="noopener noreferrer">Read all {config.reviewCount} reviews <ArrowUpRight size={15} /></a></div>
        </div>
      </div>
      <div aria-label="Reviews from students and parents">
        {[false, true].map((reverse) => (
          <div className={`review-marquee ${reducedMotion ? 'review-static' : ''} ${reverse ? 'review-row-secondary' : ''}`} key={String(reverse)} aria-hidden={reverse || undefined} onTouchStart={() => setTouching(true)} onTouchEnd={() => setTouching(false)} onTouchCancel={() => setTouching(false)}>
            <div className={`review-track ${reverse ? 'reverse' : ''} ${touching ? 'paused' : ''}`}>{loopReviews.map((review, i) => <ReviewCard key={`${i}-${review.text}`} review={review} hidden={i >= reviews.length} />)}</div>
          </div>
        ))}
      </div>
      <div className="wrap review-caption"><span><ShieldCheck size={16} /> Shared by our community on Google</span><a href={config.google} target="_blank" rel="noopener noreferrer">View Google profile <ArrowUpRight size={14} /></a></div>
    </section>
  )
}

function FaqSection() {
  return (
    <section className="section faq-section" id="faq">
      <div className="wrap faq-layout">
        <div className="faq-intro">
          <span className="eyebrow">A few helpful answers</span>
          <h2>Good questions.<br /><em>Clear answers.</em></h2>
          <p>Looking for tuition in Laxmi Nagar or coaching near Jagat Ram Park? Here are a few things families often ask.</p>
        </div>
        <div className="faq-list">
          {config.faqs.map((item) => (
            <details className="faq-item" key={item.question}>
              <summary>{item.question}<ChevronDown size={17} aria-hidden="true" /></summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function EnquiryForm({ selectedClass = '' }) {
  const navigate = useNavigate()
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [form, setForm] = useState({ studentName: '', parentName: '', phone: '', course: selectedClass, mode: '', message: '', consent: false, website: '' })
  useEffect(() => {
    if (selectedClass) setForm((current) => ({ ...current, course: selectedClass }))
  }, [selectedClass])

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')
    if (form.website) return
    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      setError('Enter a valid 10-digit Indian mobile number.')
      return
    }
    if (!form.consent) {
      setError('Please read and accept the privacy policy to continue.')
      return
    }
    setStatus('loading')
    const message = [
      `Hello ${config.name}, I would like to enquire about classes.`,
      `Student name: ${form.studentName.trim()}`,
      form.parentName.trim() ? `Parent/guardian name: ${form.parentName.trim()}` : '',
      `Phone: +91 ${form.phone.trim()}`,
      form.course ? `Class/course: ${form.course}` : '',
      form.mode ? `Preferred mode: ${form.mode}` : '',
      form.message.trim() ? `Message: ${form.message.trim()}` : '',
    ].filter(Boolean).join('\n')
    const link = `${config.whatsapp}?text=${encodeURIComponent(message)}`
    window.open(link, '_blank', 'noopener,noreferrer')
    setStatus('success')
    window.setTimeout(() => navigate('/thank-you'), 450)
  }

  const update = (event) => {
    const { name, value, checked, type } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }
  return (
    <form className="enquiry-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>Student name<input name="studentName" value={form.studentName} onChange={update} required autoComplete="name" placeholder="Your name" /></label>
        <label>Parent / guardian name<input name="parentName" value={form.parentName} onChange={update} required autoComplete="off" placeholder="Parent or guardian" /></label>
        <label>Mobile number<input name="phone" type="tel" inputMode="numeric" pattern="[6-9][0-9]{9}" maxLength="10" value={form.phone} onChange={update} required autoComplete="tel-national" placeholder="10-digit Indian mobile" aria-describedby={error ? 'form-error' : undefined} /></label>
        <label>Class or course<select name="course" value={form.course} onChange={update} required><option value="">Select a class</option>{config.courses.map((course) => <option key={course.id} value={course.label}>{course.label}</option>)}</select></label>
        <label>Preferred mode <span className="optional">(optional)</span><input name="mode" value={form.mode} onChange={update} placeholder="Mention a preference, if any" /></label>
        <label className="form-wide">Message <span className="optional">(optional)</span><textarea name="message" rows="3" maxLength="600" value={form.message} onChange={update} placeholder="What would you like to know?" /></label>
      </div>
      <label className="honeypot" aria-hidden="true">Leave this field empty<input name="website" value={form.website} onChange={update} tabIndex="-1" autoComplete="off" /></label>
      <label className="consent"><input type="checkbox" name="consent" checked={form.consent} onChange={update} required /><span>I agree to the <Link to="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</Link> and to sharing these details with the academy via WhatsApp.</span></label>
      {error && <p className="form-error" id="form-error" role="alert">{error}</p>}
      {status === 'success' && <p className="form-success" role="status"><Check size={16} /> Opening WhatsApp with your message…</p>}
      <button className="button button-primary form-submit" type="submit" disabled={status === 'loading' || status === 'success'}>{status === 'loading' ? 'Preparing message…' : 'Send enquiry on WhatsApp'} <ArrowUpRight size={17} /></button>
      <p className="form-note">Your message opens in WhatsApp. It is not stored on this website.</p>
    </form>
  )
}

function Contact({ selectedClass = '' }) {
  const mapQuery = encodeURIComponent('M 161, Block M, Jagat Ram Park, Laxmi Nagar, Delhi 110092')
  return (
    <>
      <section className="section enquiry-section" id="contact">
        <div className="wrap enquiry-layout">
          <div className="enquiry-intro">
            <span className="eyebrow">One conversation can help</span>
            <h2>Let’s find the<br /><em>right next step.</em></h2>
            <p>Tell us what you’re looking for. Our team can help you explore classes at The Bansal Academy.</p>
            <div className="contact-shortcuts">
              <a href={config.phoneLink}><span><Phone size={18} /></span><div><small>Call us</small><strong>{config.phone}</strong></div><ArrowUpRight size={15} /></a>
              <a href={config.whatsapp} target="_blank" rel="noopener noreferrer"><span><MessageCircle size={18} /></span><div><small>Message us on</small><strong>WhatsApp</strong></div><ArrowUpRight size={15} /></a>
            </div>
          </div>
          <div className="form-card"><EnquiryForm selectedClass={selectedClass} /></div>
        </div>
      </section>
      <section className="section contact-section">
        <div className="wrap contact-layout">
          <div><span className="eyebrow">Find us in Laxmi Nagar</span><h2>Come say<br /><em>hello.</em></h2>
            <p className="address-line"><MapPin size={19} />{config.address}</p>
            <div className="contact-buttons"><a className="button button-primary" href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} target="_blank" rel="noopener noreferrer">Get directions <ArrowUpRight size={16} /></a><a className="button button-outline" href={config.phoneLink}>Call the academy <Phone size={16} /></a></div>
          </div>
          <div className="map-frame"><iframe title="Map showing The Bansal Academy in Laxmi Nagar, Delhi" src={`https://www.google.com/maps?q=${mapQuery}&output=embed`} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div>
        </div>
      </section>
    </>
  )
}

function Home() {
  const location = useLocation()
  const [selectedClass, setSelectedClass] = useState(location.state?.selectedClass ?? '')
  const reduce = useReducedMotion()
  useEffect(() => {
    if (!location.hash) return
    const id = decodeURIComponent(location.hash.slice(1))
    window.requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }))
  }, [location.hash, reduce])
  const chooseClass = (course) => {
    setSelectedClass(course)
    document.getElementById('contact')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
  }
  const jsonLd = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': ['EducationalOrganization', 'LocalBusiness'],
    name: config.name,
    description: config.about,
    address: { '@type': 'PostalAddress', streetAddress: config.address, addressLocality: 'Delhi', postalCode: '110092', addressCountry: 'IN' },
    telephone: config.phone,
    sameAs: [config.instagram, config.facebook, config.google],
    logo: `${config.siteUrl}/logo.png`,
    aggregateRating: { '@type': 'AggregateRating', ratingValue: config.rating, reviewCount: config.reviewCount, bestRating: '5' },
  }), [])
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: config.faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  }
  const founderJsonLd = config.founder.name
    ? { '@context': 'https://schema.org', '@type': 'Person', name: config.founder.name, jobTitle: 'Founder, The Bansal Academy', worksFor: { '@type': 'EducationalOrganization', name: config.name }, ...(config.founder.photo ? { image: config.founder.photo } : {}) }
    : null
  return (
    <>
      <Seo />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
        {founderJsonLd && <script type="application/ld+json">{JSON.stringify(founderJsonLd)}</script>}
      </Helmet>
      <main id="main">
        <section className="hero">
          <div className="hero-orb hero-orb-one" aria-hidden="true" /><div className="hero-orb hero-orb-two" aria-hidden="true" />
          <div className="wrap hero-inner">
            <motion.div className="hero-copy" initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
              <span className="eyebrow"><span className="eyebrow-dot" /> Concept-focused coaching · Laxmi Nagar, Delhi</span>
              <h1>Best Coaching in Laxmi Nagar for Class 9 to 12</h1>
              <p>{config.about}</p>
              <div className="hero-actions"><a className="button button-primary" href="#contact">Book a free demo <ArrowUpRight size={17} /></a><a className="button button-quiet" href={config.phoneLink}><Phone size={17} /> Call now</a></div>
              <a className="google-chip" href={config.google} target="_blank" rel="noopener noreferrer"><span className="chip-stars" aria-hidden="true">★★★★★</span><span><strong>{config.rating} on Google</strong><small>{config.reviewCount} reviews</small></span><ArrowUpRight size={15} /></a>
            </motion.div>
            <div className="hero-visual" aria-label="A welcoming place to learn">
              <div className="hero-image-card">
                <Link className="hero-founder-link hero-founder-link-text" to="/founder" aria-label="Meet the Founder of The Bansal Academy">
                  <img className="hero-founder-photo" src={config.founder.photo} alt="Naman Bansal, Founder of The Bansal Academy" width="768" height="1024" fetchPriority="high" decoding="async" />
                  <span className="hero-founder-copy">
                    <span className="hero-founder-label">Meet the Founder <ArrowRight size={16} /></span>
                    <strong className="hero-founder-name">Naman Bansal</strong>
                  </span>
                </Link>
              </div>
            </div>
          </div>
          <div className="wrap hero-bottom"><span>Thoughtful teaching, right here in your neighbourhood</span><a href="#reels">Take a look around <ArrowDown size={14} /></a></div>
        </section>
        <Reels />
        <PhotoGallery />
        <Classes onSelect={chooseClass} />
        <Reviews />
        <FaqSection />
        <Contact selectedClass={selectedClass} />
      </main>
    </>
  )
}

function FounderPage() {
  const founder = config.founder
  const hasDetails = Boolean(founder.name || founder.photo || founder.story || founder.qualifications || founder.experience || founder.vision || founder.message || founder.teachingJourney.length)
  return (
    <main id="main" className="subpage">
      <Seo page="founder" />
      <section className="subpage-hero"><div className="wrap"><span className="eyebrow">The people who make a difference</span><h1>Meet the<br /><em>founder.</em></h1><p>Teaching is more than explaining a subject. It’s helping someone find their own way through it.</p></div></section>
      <section className="section founder-detail"><div className="wrap founder-detail-grid">
        {founder.photo && <img className="founder-detail-photo" src={founder.photo} alt={founder.name ? `Portrait of ${founder.name}` : 'Portrait shared by The Bansal Academy'} loading="lazy" />}
        <div className="founder-detail-copy">
          {founder.name && <><span className="eyebrow">Founder, The Bansal Academy</span><h2>{founder.name}</h2></>}
          {founder.qualifications && <p className="founder-credential">{founder.qualifications}</p>}
          {founder.experience && <p className="founder-credential">{founder.experience}</p>}
          {Array.isArray(founder.story)
            ? founder.story.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
            : founder.story && <p>{founder.story}</p>}
          {founder.vision && <div className="vision-card"><span className="eyebrow">A vision for learning</span><p>{founder.vision}</p></div>}
          {!hasDetails && <div className="founder-pending"><GraduationCap size={30} /><p>Founder details will be shared here when confirmed by the academy.</p></div>}
          {founder.teachingJourney.length > 0 && <div className="timeline"><h3>Teaching journey</h3>{founder.teachingJourney.map((step, i) => <div className="timeline-row" key={`${step.year}-${i}`}><span>{step.year}</span><p>{step.text}</p></div>)}</div>}
        </div>
        {founder.message && <blockquote className="founder-quote"><Quote size={22} /><p>{founder.message}</p><cite>{founder.name || 'Founder, The Bansal Academy'}</cite></blockquote>}
      </div><div className="center"><a className="button button-primary" href="/#contact">Book a free demo class <ArrowUpRight size={16} /></a></div></section>
    </main>
  )
}

function PolicyPage() {
  return (
    <main id="main" className="legal-page"><Seo page="privacy" /><div className="wrap legal-wrap">
      <span className="eyebrow"><ShieldCheck size={15} /> Your privacy matters</span><h1>Privacy <em>policy.</em></h1>
      <p className="legal-lede">This policy explains how The Bansal Academy handles information when you contact us through this website.</p>
      <p className="last-updated">Last updated: {config.lastUpdated}</p>
      <section><h2>Information you share</h2><p>If you make an enquiry, the form may ask for a student’s name, a parent or guardian’s name, a mobile number, a class or course, a preferred mode, and a message. The website does not save these details to a database. When you submit, it prepares a message and opens WhatsApp so you can review and send it.</p></section>
      <section><h2>Why it is used</h2><p>The information is used to respond to your class enquiry and discuss relevant coaching options. Please do not include sensitive personal information in the message.</p></section>
      <section><h2>Who can see it</h2><p>Information you choose to send is shared with academy staff through WhatsApp. The Bansal Academy does not sell your personal information. WhatsApp is operated by Meta and its own privacy terms apply after you choose to send a message.</p></section>
      <section><h2>Third-party services</h2><p>This website links to or embeds Google Maps and Google reviews, WhatsApp, Instagram, Facebook, and the website hosting provider. If a form service is configured later, its details will be added here. These services may process information under their own privacy policies.</p></section>
      <section><h2>Cookies and retention</h2><p>This site does not intentionally set advertising or analytics cookies. Hosting or embedded third-party services may use their own cookies. Enquiry details are not stored by this website; messages sent through WhatsApp are subject to WhatsApp’s retention practices and your chat settings.</p></section>
      <section><h2>Security</h2><p>We use reasonable measures to keep the website secure. No internet transmission or storage method can be guaranteed completely secure.</p></section>
      <section><h2>Children and guardians</h2><p>For a student under 18, a parent or legal guardian should submit the enquiry and provide any personal information.</p></section>
      <section><h2>Your choices and rights</h2><p>You may ask to access, correct, or delete information you have shared with the academy, or withdraw consent for further contact, subject to applicable law. For messages already sent, you may also manage or delete your copy in WhatsApp. To make a request, call <a href={config.phoneLink}>{config.phone}</a>.</p></section>
      <section><h2>Contact and grievance requests</h2><p>Contact The Bansal Academy at <a href={config.phoneLink}>{config.phone}</a> with privacy questions or requests. The academy has not provided a separate grievance officer contact for publication.</p></section>
      <p className="policy-law">This notice is intended to be read consistently with applicable Indian privacy law, including the Digital Personal Data Protection Act, 2023.</p>
    </div></main>
  )
}

function TermsPage() {
  return (
    <main id="main" className="legal-page"><Seo page="terms" /><div className="wrap legal-wrap">
      <span className="eyebrow">A few useful details</span><h1>Terms of <em>use.</em></h1>
      <p className="legal-lede">By using this website, you agree to the following straightforward terms.</p>
      <section><h2>Website information</h2><p>Content is provided for general information about The Bansal Academy and its coaching offerings. Please contact the academy directly to confirm class availability and details, as these may change.</p></section>
      <section><h2>No guarantee of results</h2><p>Every student’s learning journey is different. The website makes no guarantee of academic results, admission, or any particular outcome.</p></section>
      <section><h2>Intellectual property</h2><p>Unless otherwise stated, the text and visual identity on this website belong to The Bansal Academy. Please do not reproduce or reuse them without permission.</p></section>
      <section><h2>Third-party links</h2><p>Links to Google, WhatsApp, Instagram, Facebook, and other third-party services are provided for convenience. Those services operate under their own terms and policies.</p></section>
      <section><h2>Availability and changes</h2><p>We may update the website or these terms from time to time. Website content is provided without a guarantee that access will always be uninterrupted or error-free.</p></section>
      <section><h2>Governing law</h2><p>These terms are governed by the laws of India. Courts in Delhi, India will have jurisdiction, subject to applicable law.</p></section>
      <p className="last-updated">Last updated: {config.lastUpdated}</p>
    </div></main>
  )
}

function ThankYou() {
  return <main id="main" className="message-page"><Seo page="thanks" noindex /><span className="message-icon"><Check size={28} /></span><span className="eyebrow">Enquiry ready</span><h1>Thank you for<br /><em>reaching out.</em></h1><p>Your message is ready in WhatsApp. Send it there and the academy can get back to you.</p><div className="message-actions"><a className="button button-primary" href={config.whatsapp} target="_blank" rel="noopener noreferrer">Open WhatsApp <ArrowUpRight size={16} /></a><Link className="button button-outline" to="/">Back to home</Link></div></main>
}

function NotFound() {
  return <main id="main" className="message-page"><Seo page="notFound" /><span className="eyebrow">404 · Page not found</span><h1>Looks like this<br /><em>page got lost.</em></h1><p>The page may have moved. You can head back to the academy or explore a little more.</p><div className="message-actions"><Link className="button button-primary" to="/">Back to home <ArrowLeft size={16} /></Link><Link className="button button-outline" to="/founder">Meet the founder</Link><Link className="text-link" to="/#classes">Explore classes <ArrowRight size={15} /></Link></div></main>
}

function ErrorBoundaryPage() {
  return <main id="main" className="message-page"><Seo page="notFound" /><span className="eyebrow">Something went wrong</span><h1>We’ll get you<br /><em>back on track.</em></h1><p>Please try again, or return to the home page.</p><div className="message-actions"><Link className="button button-primary" to="/">Back to home <ArrowLeft size={16} /></Link></div></main>
}

class SiteErrorBoundary extends React.Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('The academy website encountered an unexpected error.', error, info)
  }

  render() {
    if (this.state.hasError) return <ErrorBoundaryPage />
    return this.props.children
  }
}

function App() {
  return (
    <div className="app-shell">
      <Header />
      <SiteErrorBoundary>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/founder" element={<FounderPage />} />
          <Route path="/privacy-policy" element={<PolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SiteErrorBoundary>
      <Footer />
      <MobileBar />
    </div>
  )
}

export default App
