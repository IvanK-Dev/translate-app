const createQuery = (entity) => (direction) => {
  const withImage = entity === "product" || entity === "collection";
  const queryEntity = entity.toUpperCase();

  const queryDirection =
    direction === "forward"
      ? `(first: $numEntities, after: $cursor, resourceType: ${queryEntity})`
      : `(last: $numEntities, before: $cursor, resourceType: ${queryEntity})`;

  const queryDirectionForImages =
    direction === "forward"
      ? `(first: $numEntities, after: $cursor)`
      : `(last: $numEntities, before: $cursor)`;

  const queryImages = `
    images: ${entity}s${queryDirectionForImages} {
      edges {
        node {
          id
          ${entity === "product" ? "featuredImage" : "image"} {
            altText
            url
          }
        }
      }
    }
  `;

  return `
  query CombinedQuery($numEntities: Int!, $cursor: String) {
    resources: translatableResources${queryDirection} {
      edges {
        node {
          resourceId 
          translatableContent { 
            key 
            value 
            digest 
            locale 
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
    ${withImage ? queryImages : ""}
  }
  `;
};

export const QUERIES = {
  product: createQuery("product"),
  collection: createQuery("collection"),
  blog_post: createQuery("online_store_article"),
  blog_title: createQuery("online_store_blog"),
  filter: createQuery("filter"),
  metaobject: createQuery("metaobject"),
  navigation: createQuery("online_store_menu"),
  page: createQuery("online_store_page"),
  policie: createQuery("shop_policy"),
  store_metadata: createQuery("shop"),
  app_embed: createQuery("online_store_theme_app_embed"),
  default_theme_content: createQuery("online_store_theme_locale_content"),
  section_group: createQuery("online_store_theme_section_group"),
  static_section: createQuery("online_store_theme_settings_data_sections"),
  template: createQuery("online_store_theme_template"),
  theme_setting: createQuery("online_store_theme_settings_category"),
  notification: createQuery("email_template"),
  shipping_and_delivery: createQuery("delivery_profile"),
};
