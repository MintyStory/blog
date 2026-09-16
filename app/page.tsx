import { getAllPosts, sortPosts } from "@/lib/posts";
import Hero from "@/components/home/Hero";
import CategoriesSection from "@/components/home/CategoriesSection";
import AboutTeaser from "@/components/home/AboutTeaser";
import PopularCarousel from "@/components/home/PopularCarousel";
import LatestPostsSection from "@/components/home/LatestPostsSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import ClosingSection from "@/components/home/ClosingSection";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const posts = await getAllPosts();
  const popularPosts = posts.filter((p) => p.popular);
  const latestPosts = sortPosts(posts, "latest").slice(0, 5);
  const pick = popularPosts[0] ?? posts[0];

  return (
    <>
      {pick && <Hero pick={pick} />}
      <CategoriesSection />
      <AboutTeaser />
      <PopularCarousel posts={popularPosts} />
      <LatestPostsSection posts={latestPosts} />
      <NewsletterSection />
      <ClosingSection />
    </>
  );
}
