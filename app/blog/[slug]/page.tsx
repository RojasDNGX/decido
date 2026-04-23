import { Fragment } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPostBySlug, posts, PostSection } from '../posts';

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Artigo não encontrado | Blog Decido' };
  return {
    title: `${post.title} | Blog Decido`,
    description: post.description,
  };
}

function renderSection(section: PostSection, index: number) {
  const bodyStyle: React.CSSProperties = {
    color: '#d1d5db',
    lineHeight: '1.85',
    fontSize: '1.1rem',
    marginTop: '1.6rem',
  };
  const h2Style: React.CSSProperties = {
    fontSize: '1.6rem',
    fontWeight: '800',
    color: '#f9fafb',
    marginTop: '3rem',
    marginBottom: '0.5rem',
    lineHeight: '1.3',
  };
  const h3Style: React.CSSProperties = {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#e5e7eb',
    marginTop: '2rem',
    marginBottom: '0.4rem',
  };
  const listStyle: React.CSSProperties = {
    ...bodyStyle,
    paddingLeft: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  };

  switch (section.type) {
    case 'h2':
      return <h2 key={index} style={h2Style}>{section.text}</h2>;
    case 'h3':
      return <h3 key={index} style={h3Style}>{section.text}</h3>;
    case 'p':
      return <p key={index} style={bodyStyle}>{section.text}</p>;
    case 'ul':
      return (
        <ul key={index} style={listStyle}>
          {section.items?.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      );
    case 'ol':
      return (
        <ol key={index} style={listStyle}>
          {section.items?.map((item, i) => <li key={i}>{item}</li>)}
        </ol>
      );
    case 'internal-link':
      return (
        <p key={index} style={{ ...bodyStyle, marginTop: '2rem' }}>
          {section.linkContext}
          <Link
            href={section.linkHref!}
            style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'underline' }}
          >
            {section.linkText}
          </Link>
          {section.linkContextAfter}
        </p>
      );
    default:
      return null;
  }
}

const MID_CTA_AFTER = 4; // insert mid-content CTA after this many sections

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const midCTA = (
    <div
      style={{
        margin: '3rem 0',
        padding: '2rem 2.5rem',
        background: 'var(--glass)',
        border: '1px solid var(--glass-border)',
        borderRadius: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '2rem',
        flexWrap: 'wrap',
      }}
    >
      <p style={{ color: '#d1d5db', fontSize: '1rem', margin: 0, lineHeight: '1.6', flex: 1 }}>
        {post.midCta.text}
      </p>
      <Link
        href="/decidir"
        style={{
          display: 'inline-block',
          padding: '0.75rem 1.75rem',
          background: 'var(--primary)',
          color: 'white',
          borderRadius: '0.75rem',
          fontWeight: '700',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          fontSize: '0.95rem',
        }}
      >
        {post.midCta.label}
      </Link>
    </div>
  );

  const endCTA = (
    <div
      style={{
        marginTop: '4rem',
        padding: '2.5rem',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        borderRadius: '1.5rem',
        textAlign: 'center',
      }}
    >
      <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '0.75rem' }}>
        {post.endCta.heading}
      </h2>
      <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '1.75rem', fontSize: '1rem' }}>
        {post.endCta.sub}
      </p>
      <Link
        href="/decidir"
        style={{
          display: 'inline-block',
          padding: '1rem 2.25rem',
          background: 'white',
          color: '#1e3a8a',
          borderRadius: '1rem',
          fontWeight: '800',
          textDecoration: 'none',
          fontSize: '1rem',
        }}
      >
        {post.endCta.label}
      </Link>
    </div>
  );

  return (
    <main>
      <div
        className="landing-container"
        style={{ paddingTop: '8rem', paddingBottom: '8rem', maxWidth: '760px' }}
      >
        {/* Back link */}
        <Link
          href="/blog"
          style={{
            color: 'var(--primary)',
            textDecoration: 'none',
            marginBottom: '3rem',
            display: 'block',
            fontSize: '0.9rem',
            fontWeight: '600',
          }}
        >
          ← Voltar para o Blog
        </Link>

        {/* Article header */}
        <header style={{ marginBottom: '3rem' }}>
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: '800',
              color: 'var(--primary)',
              letterSpacing: '0.1em',
              display: 'block',
              marginBottom: '1rem',
            }}
          >
            {post.category}
          </span>
          <h1
            className="landing-h1"
            style={{ marginBottom: '1.25rem', fontSize: 'clamp(2rem, 5vw, 2.8rem)' }}
          >
            {post.title}
          </h1>
          <p style={{ color: '#a3a3a3', fontSize: '1rem' }}>
            {post.date} · {post.readTime}
          </p>
        </header>

        {/* Article body with mid-CTA injected */}
        <article>
          {post.sections.map((section, index) => (
            <Fragment key={index}>
              {renderSection(section, index)}
              {index === MID_CTA_AFTER && midCTA}
            </Fragment>
          ))}
        </article>

        {/* End CTA */}
        {endCTA}
      </div>
    </main>
  );
}
