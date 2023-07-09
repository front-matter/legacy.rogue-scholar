export async function updateSchema() {
  // eslint-disable-next-line no-unused-vars
  const schema = {
    name: "posts",
    fields: [
      {
        name: "id",
        type: "string",
        facet: false,
        optional: false,
      },
      {
        name: "doi",
        type: "string",
        facet: false,
        optional: false,
      },
      {
        name: "url",
        type: "string",
        facet: false,
        optional: false,
      },
      {
        name: "blog_id",
        type: "string",
        facet: true,
        optional: false,
      },
      {
        name: "title",
        type: "string",
        facet: false,
        optional: false,
      },
      {
        name: "summary",
        type: "string",
        facet: false,
        optional: false,
      },
      {
        name: "content_html",
        type: "string",
        facet: false,
        optional: false,
      },
      {
        name: "authors",
        type: "object[]",
        facet: true,
        optional: true,
      },
      {
        name: "tags",
        type: "string[]",
        facet: true,
        optional: true,
      },
      {
        name: "references",
        type: "object[]",
        facet: false,
        optional: true,
      },
      {
        name: "image",
        type: "string",
        facet: false,
        optional: true,
      },
      {
        name: "date_published",
        type: "int32",
        facet: true,
        optional: false,
      },
      {
        name: "date_modified",
        type: "int32",
        facet: false,
        optional: false,
      },
      {
        name: "language",
        type: "string",
        facet: true,
        optional: true,
      },
    ],
    default_sorting_field: "date_published",
  }
}
