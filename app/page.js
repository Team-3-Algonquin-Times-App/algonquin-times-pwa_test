"use client";
import styles from "./page.module.css";
import { useEffect, useState } from "react";

export default function Page() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch("https://algonquintimes.com/wp-json/wp/v2/posts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts from WordPress API");
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

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

          return (
            <li key={post.id} className={styles.postItem}>
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