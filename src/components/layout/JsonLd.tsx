import { personalInfo, siteConfig, projects, education } from "@/data/portfolio";

export function JsonLd() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: personalInfo.name,
    givenName: personalInfo.name.split(" ")[0],
    familyName: personalInfo.name.split(" ").slice(1).join(" "),
    jobTitle: personalInfo.title,
    email: personalInfo.email,
    telephone: personalInfo.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: personalInfo.location.split(",")[0]?.trim(),
      addressCountry: "IN",
    },
    url: siteConfig.url,
    sameAs: [
      personalInfo.github,
      `https://linkedin.com/in/${personalInfo.linkedin.replace(/\s+/g, "").toLowerCase()}`,
    ],
    knowsAbout: ["React", "Next.js", "TypeScript", "Web Development", "Frontend Engineering"],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${personalInfo.name} - Portfolio`,
    url: siteConfig.url,
    author: { "@type": "Person", name: personalInfo.name },
    description: siteConfig.description,
  };

  const projectSchemas = projects.slice(0, 4).map((p) => ({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: p.title,
    description: p.description,
    url: p.liveUrl,
    applicationCategory: p.category,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: { "@type": "Person", name: personalInfo.name },
  }));

  const educationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: education.school,
    address: { "@type": "PostalAddress", addressLocality: education.location },
  };

  const schemas = [personSchema, websiteSchema, educationSchema, ...projectSchemas];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemas),
      }}
    />
  );
}
