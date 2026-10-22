import HeroSection from '../components/sections/HeroSection';
import ServicesSection from '../components/sections/ServicesSection';
import LatestWorkSection from '../components/sections/LatestWorkSection';
import WhyChooseUs from '../components/sections/WhyChooseUs';
import EditorialSection from '../components/sections/EditorialSection';
import Testimonials from '../components/sections/Testimonials';
import ContactSection from '../components/sections/ContactSection';
import StrapStudioSection from '../components/sections/StrapStudioSection';
import FAQ from '../components/common/FAQ';
import CTA from '../components/common/CTA';
import Reveal from '../components/common/Reveal';
import CraftMarquee from '../components/common/CraftMarquee';
import SEO from '../components/seo/SEO';
import { organizationSchema, websiteSchema, webpageSchema, faqSchema } from '../utils/schemaHelpers';
import { homeFaqs } from '../data/contextualFaqs';
import { siteConfig } from '../data/siteConfig';
export default function Home() {
  return <>
    <SEO title="Handmade Leather Watch Straps" path="/" description={siteConfig.description} schema={[organizationSchema, websiteSchema, webpageSchema('/', 'YellowCada handmade leather watch straps', siteConfig.description), faqSchema(homeFaqs)]}/>
    <HeroSection/>
    <CraftMarquee className="hidden sm:block"/>
    <Reveal variant="up"><StrapStudioSection/></Reveal>
    <CraftMarquee className="sm:hidden"/>
    <Reveal variant="up"><ServicesSection/></Reveal>
    <LatestWorkSection/>
    <Reveal variant="up"><WhyChooseUs/></Reveal>
    <Reveal variant="up"><EditorialSection/></Reveal>
    <Reveal variant="fade"><Testimonials/></Reveal>
    <FAQ entries={homeFaqs}/>
    <Reveal variant="scale"><CTA/></Reveal>
    <ContactSection/>
  </>;
}
