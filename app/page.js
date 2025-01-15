"use client";
import styles from "./page.module.css";

async function fetchPosts() {
  try {
    const response = await fetch("https://algonquintimes.com/wp-json/wp/v2/posts", {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch posts from WordPress API");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export default async function Page() {

  const posts = await fetchPosts();

  if (!posts || posts.length === 0) {
    return <p>No posts available at the moment.</p>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Algonquin Times API Test and PWA</h1>
      <ul className={styles.postList}>
        {posts.map((post) => {
          const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          const imageUrl = post?.parsely?.meta?.image?.url;

          return (
            <li key={post.id} className={styles.postItem}>
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={post.title.rendered}
                  className={styles.postImage}
                />
              )}
              <a
                href={post.link}
                rel="noopener noreferrer"
                className={styles.postLink}
              >
                <h2 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
              </a>
              <p className={styles.postDate}>{formattedDate}</p>
              <p
                dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                className={styles.postExcerpt}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}