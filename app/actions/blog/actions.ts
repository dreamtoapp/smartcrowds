'use server';

import { prisma } from '@/lib/prisma';
import { postSchema, categorySchema, tagSchema, type PostInput, type CategoryInput, type TagInput } from '@/lib/validations/blog';
import { revalidatePath } from 'next/cache';
import { calculateReadingTime } from '@/lib/utils/blog';

// Helper to generate slug from title
function generateSlug(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Post Actions
export async function createPost(data: Omit<PostInput, 'slug'> & { slug?: string }) {
  try {
    // Generate slug from Arabic title first, then English, then use provided slug
    const slug = data.slug || generateSlug(data.titleAr || data.title || '');

    // Check if slug exists
    const existing = await prisma.post.findUnique({
      where: { slug },
    });

    if (existing) {
      return { error: 'A post with this slug already exists' };
    }

    const validated = postSchema.parse({
      ...data,
      slug,
    });

    const content = validated.contentAr || validated.content || '';
    const readingTime = calculateReadingTime(content);

    // Find or create author
    let author = await prisma.author.findFirst({
      where: { name: validated.authorName },
    });

    if (!author) {
      author = await prisma.author.create({
        data: {
          name: validated.authorName,
          email: `${validated.authorName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        },
      });
    }

    const post = await prisma.post.create({
      data: {
        title: validated.title || validated.titleAr || '',
        titleAr: validated.titleAr,
        slug: validated.slug,
        content: validated.content || validated.contentAr || '',
        contentAr: validated.contentAr,
        excerpt: validated.excerpt,
        excerptAr: validated.excerptAr,
        featuredImage: validated.featuredImage || null,
        authorId: author.id,
        published: validated.published,
        publishedAt: validated.published ? (validated.publishedAt || new Date()) : null,
        locale: validated.locale,
        seoTitle: validated.seoTitle,
        seoDescription: validated.seoDescription,
        keywords: validated.keywords,
        readingTime,
        categories: {
          create: validated.categoryIds.map((categoryId) => ({
            categoryId,
          })),
        },
        tags: {
          create: validated.tagIds.map((tagId) => ({
            tagId,
          })),
        },
      },
      include: {
        author: true,
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    revalidatePath('/blog');
    revalidatePath(`/blog/${post.slug}`);

    return { success: true, post };
  } catch (error) {
    console.error('Error creating post:', error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Failed to create post' };
  }
}

export async function updatePost(id: string, data: Partial<PostInput> & { slug?: string; authorName?: string; readingTime?: number }) {
  try {
    const existing = await prisma.post.findUnique({
      where: { id },
    });

    if (!existing) {
      return { error: 'Post not found' };
    }

    const slug = data.slug || existing.slug;

    // Check if slug exists on another post
    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await prisma.post.findFirst({
        where: {
          slug,
          id: { not: id },
        },
      });

      if (slugExists) {
        return { error: 'A post with this slug already exists' };
      }
    }

    // Handle author name if provided
    let authorId = existing.authorId;
    if (data.authorName) {
      let author = await prisma.author.findFirst({
        where: { name: data.authorName },
      });

      if (!author) {
        author = await prisma.author.create({
          data: {
            name: data.authorName,
            email: `${data.authorName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
          },
        });
      }
      authorId = author.id;
    }

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.titleAr !== undefined) updateData.titleAr = data.titleAr;
    if (data.slug !== undefined) updateData.slug = slug;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.contentAr !== undefined) updateData.contentAr = data.contentAr;
    if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
    if (data.excerptAr !== undefined) updateData.excerptAr = data.excerptAr;
    if (data.featuredImage !== undefined) updateData.featuredImage = data.featuredImage || null;
    if (data.authorName) updateData.authorId = authorId;
    if (data.published !== undefined) {
      updateData.published = data.published;
      if (data.published && !existing.publishedAt) {
        updateData.publishedAt = new Date();
      }
      if (!data.published) {
        updateData.publishedAt = null;
      }
    }
    if (data.seoTitle !== undefined) updateData.seoTitle = data.seoTitle;
    if (data.seoDescription !== undefined) updateData.seoDescription = data.seoDescription;
    if (data.keywords !== undefined) updateData.keywords = data.keywords;

    // Handle reading time: use provided value or calculate from content (prioritize Arabic)
    if (data.readingTime !== undefined) {
      updateData.readingTime = data.readingTime;
    } else if (data.contentAr !== undefined && data.contentAr) {
      updateData.readingTime = calculateReadingTime(data.contentAr);
    } else if (data.content !== undefined && data.content) {
      updateData.readingTime = calculateReadingTime(data.content);
    }

    // Update categories and tags first if provided
    if (data.categoryIds !== undefined) {
      // Delete existing categories
      await prisma.postCategory.deleteMany({
        where: { postId: id },
      });
      // Create new category relations only if there are categories to add
      if (data.categoryIds.length > 0) {
        await prisma.postCategory.createMany({
          data: data.categoryIds.map((categoryId) => ({
            postId: id,
            categoryId,
          })),
        });
      }
    }

    if (data.tagIds !== undefined) {
      // Delete existing tags
      await prisma.postTag.deleteMany({
        where: { postId: id },
      });
      // Create new tag relations only if there are tags to add
      if (data.tagIds.length > 0) {
        await prisma.postTag.createMany({
          data: data.tagIds.map((tagId) => ({
            postId: id,
            tagId,
          })),
        });
      }
    }

    const post = await prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        author: true,
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    revalidatePath('/blog');
    revalidatePath(`/blog/${post.slug}`);

    return { success: true, post };
  } catch (error) {
    console.error('Error updating post:', error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Failed to update post' };
  }
}

export async function deletePost(id: string) {
  try {
    await prisma.post.delete({
      where: { id },
    });

    revalidatePath('/blog');

    return { success: true };
  } catch (error) {
    console.error('Error deleting post:', error);
    return { error: 'Failed to delete post' };
  }
}

export async function getPosts(options?: {
  locale?: string;
  published?: boolean;
  category?: string;
  tag?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const {
      locale,
      published,
      category,
      tag,
      page = 1,
      limit = 10,
    } = options || {};

    const where: any = {};

    // Only filter by locale if explicitly provided
    if (locale !== undefined && locale !== null) {
      where.locale = locale;
    }

    if (published !== undefined) {
      where.published = published;
    }

    if (category) {
      const categoryRecord = await prisma.category.findUnique({
        where: { slug: category },
      });
      if (categoryRecord) {
        const postIds = (
          await prisma.postCategory.findMany({
            where: { categoryId: categoryRecord.id },
            select: { postId: true },
          })
        ).map((pc: any) => pc.postId);
        if (postIds.length > 0) {
          where.id = { in: postIds };
        } else {
          // No posts in this category, return empty result
          return { posts: [], pagination: { page, limit, total: 0, totalPages: 0 } };
        }
      } else {
        // Category not found, return empty result
        return { posts: [], pagination: { page, limit, total: 0, totalPages: 0 } };
      }
    }

    if (tag) {
      const tagRecord = await prisma.tag.findUnique({
        where: { slug: tag },
      });
      if (tagRecord) {
        const postIds = (
          await prisma.postTag.findMany({
            where: { tagId: tagRecord.id },
            select: { postId: true },
          })
        ).map((pt: any) => pt.postId);

        if (postIds.length === 0) {
          // No posts with this tag, return empty result
          return { posts: [], pagination: { page, limit, total: 0, totalPages: 0 } };
        }

        // If both category and tag filters, intersect
        if (category && where.id && where.id.in) {
          const existingIds = Array.isArray(where.id.in) ? where.id.in : [where.id.in];
          const intersection = existingIds.filter((postId: any) => postIds.includes(postId));
          if (intersection.length === 0) {
            return { posts: [], pagination: { page, limit, total: 0, totalPages: 0 } };
          }
          where.id.in = intersection;
        } else {
          where.id = { in: postIds };
        }
      } else {
        // Tag not found, return empty result
        return { posts: [], pagination: { page, limit, total: 0, totalPages: 0 } };
      }
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: true,
          categories: {
            include: {
              category: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { posts: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } };
  }
}

export async function getPostBySlug(slug: string, locale?: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: true,
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!post) {
      return null;
    }

    if (locale && post.locale !== locale) {
      return null;
    }

    return post;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function getPostById(id: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return post;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

// Category Actions
export async function createCategory(data: CategoryInput) {
  try {
    const slug = data.slug || generateSlug(data.name);

    const existing = await prisma.category.findUnique({
      where: { slug },
    });

    if (existing) {
      return { error: 'A category with this slug already exists' };
    }

    const validated = categorySchema.parse({
      ...data,
      slug,
    });

    const category = await prisma.category.create({
      data: validated,
    });

    revalidatePath('/blog');

    return { success: true, category };
  } catch (error) {
    console.error('Error creating category:', error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Failed to create category' };
  }
}

export async function updateCategory(id: string, data: Partial<CategoryInput>) {
  try {
    const existing = await prisma.category.findUnique({
      where: { id },
    });

    if (!existing) {
      return { error: 'Category not found' };
    }

    const slug = data.slug || existing.slug;

    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await prisma.category.findFirst({
        where: {
          slug,
          id: { not: id },
        },
      });

      if (slugExists) {
        return { error: 'A category with this slug already exists' };
      }
    }

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.nameAr !== undefined) updateData.nameAr = data.nameAr;
    if (data.slug !== undefined) updateData.slug = slug;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.descriptionAr !== undefined) updateData.descriptionAr = data.descriptionAr;
    if (data.locale !== undefined) updateData.locale = data.locale;

    const category = await prisma.category.update({
      where: { id },
      data: updateData,
    });

    revalidatePath('/blog');

    return { success: true, category };
  } catch (error) {
    console.error('Error updating category:', error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Failed to update category' };
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({
      where: { id },
    });

    revalidatePath('/blog');

    return { success: true };
  } catch (error) {
    console.error('Error deleting category:', error);
    return { error: 'Failed to delete category' };
  }
}

export async function getCategories(locale?: string) {
  try {
    const where = locale ? { locale } : {};

    const categories = await prisma.category.findMany({
      where,
      orderBy: {
        name: 'asc',
      },
    });

    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Tag Actions
export async function createTag(data: TagInput) {
  try {
    const slug = data.slug || generateSlug(data.name);

    const existing = await prisma.tag.findUnique({
      where: { slug },
    });

    if (existing) {
      return { error: 'A tag with this slug already exists' };
    }

    const validated = tagSchema.parse({
      ...data,
      slug,
    });

    const tag = await prisma.tag.create({
      data: validated,
    });

    revalidatePath('/blog');

    return { success: true, tag };
  } catch (error) {
    console.error('Error creating tag:', error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Failed to create tag' };
  }
}

export async function updateTag(id: string, data: Partial<TagInput>) {
  try {
    const existing = await prisma.tag.findUnique({
      where: { id },
    });

    if (!existing) {
      return { error: 'Tag not found' };
    }

    const slug = data.slug || existing.slug;

    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await prisma.tag.findFirst({
        where: {
          slug,
          id: { not: id },
        },
      });

      if (slugExists) {
        return { error: 'A tag with this slug already exists' };
      }
    }

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.nameAr !== undefined) updateData.nameAr = data.nameAr;
    if (data.slug !== undefined) updateData.slug = slug;

    const tag = await prisma.tag.update({
      where: { id },
      data: updateData,
    });

    revalidatePath('/blog');

    return { success: true, tag };
  } catch (error) {
    console.error('Error updating tag:', error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Failed to update tag' };
  }
}

export async function deleteTag(id: string) {
  try {
    await prisma.tag.delete({
      where: { id },
    });

    revalidatePath('/blog');

    return { success: true };
  } catch (error) {
    console.error('Error deleting tag:', error);
    return { error: 'Failed to delete tag' };
  }
}

export async function getTags() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return tags;
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

// Author Actions
export async function getAuthors() {
  try {
    const authors = await prisma.author.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return authors;
  } catch (error) {
    console.error('Error fetching authors:', error);
    return [];
  }
}

export async function createAuthor(data: { name: string; email: string; bio?: string; avatar?: string }) {
  try {
    const author = await prisma.author.create({
      data,
    });

    return { success: true, author };
  } catch (error) {
    console.error('Error creating author:', error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Failed to create author' };
  }
}

