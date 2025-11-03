'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from '@/lib/routing';
import {
  updatePost,
  getPostById,
  getCategories,
  getTags,
} from '@/app/actions/blog/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AddImage from '@/components/AddImage';
import { SEOFields } from '@/components/dashboard/blog/SEOFields';
import { TiptapEditor } from '@/components/dashboard/blog/TiptapEditor';
import { calculateReadingTime } from '@/lib/utils/blog';

interface EditBlogPostPageProps {
  params: Promise<{ id: string }>;
}

export default function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const locale = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [postLocale, setPostLocale] = useState<'ar' | 'en'>('ar');
  const [tags, setTags] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    titleAr: '',
    slug: '',
    content: '',
    contentAr: '',
    excerpt: '',
    excerptAr: '',
    featuredImage: '',
    authorName: '',
    published: false,
    locale: locale as 'ar' | 'en',
    seoTitle: '',
    seoDescription: '',
    keywords: [] as string[],
    categoryIds: [] as string[],
    tagIds: [] as string[],
  });

  useEffect(() => {
    const loadData = async () => {
      const resolvedParams = await params;
      const [post, categoriesData, tagsData] = await Promise.all([
        getPostById(resolvedParams.id),
        getCategories(locale),
        getTags(),
      ]);

      if (post) {
        const postLocaleValue = (post.locale === 'ar' || post.locale === 'en') ? post.locale : 'ar';
        setPostLocale(postLocaleValue);
        setFormData({
          title: post.title || '',
          titleAr: post.titleAr || '',
          slug: post.slug,
          content: post.content || '',
          contentAr: post.contentAr || '',
          excerpt: post.excerpt || '',
          excerptAr: post.excerptAr || '',
          featuredImage: post.featuredImage || '',
          authorName: post.author?.name || '',
          published: post.published,
          locale: postLocaleValue,
          seoTitle: post.seoTitle || '',
          seoDescription: post.seoDescription || '',
          keywords: post.keywords || [],
          categoryIds: post.categories.map((c: any) => c.category.id),
          tagIds: post.tags.map((t: any) => t.tag.id),
        });
      }

      setCategories(categoriesData);
      setTags(tagsData);
      setLoading(false);
    };

    loadData();
  }, [params, locale]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const resolvedParams = await params;
    const content = formData.contentAr || formData.content || '';
    const readingTime = calculateReadingTime(content);
    const result = await updatePost(resolvedParams.id, {
      ...formData,
      readingTime,
    });

    if (result.success) {
      router.push('/dashboard/blog');
    } else {
      alert(result.error || 'Failed to update post');
    }

    setSaving(false);
  };

  const generateSlug = (title: string) => {
    if (!title) return '';
    // Remove Arabic characters and transliterate common ones
    return title
      .toLowerCase()
      .trim()
      .replace(/[ءآأإ]/g, 'a')
      .replace(/[ئؤ]/g, 'e')
      .replace(/[ى]/g, 'a')
      .replace(/[ة]/g, 'h')
      .replace(/[^\w\s-]/g, '') // Remove all non-word characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  };

  const isArabic = locale === 'ar';

  if (loading) {
    return (
      <div className="space-y-6">
        <p className="text-center">
          {isArabic ? 'جاري التحميل...' : 'Loading...'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            {isArabic ? 'تعديل المقال' : 'Edit Post'}
          </h1>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard/blog')}
            >
              {isArabic ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button type="submit" disabled={saving}>
              {saving
                ? isArabic
                  ? 'جاري الحفظ...'
                  : 'Saving...'
                : isArabic
                  ? 'حفظ'
                  : 'Save'}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'المحتوى' : 'Content'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {postLocale === 'ar' ? (
              <>
                <div>
                  <Label htmlFor="titleAr">
                    {isArabic ? 'العنوان' : 'Title'} *
                  </Label>
                  <Input
                    id="titleAr"
                    value={formData.titleAr}
                    onChange={(e) => {
                      const newTitleAr = e.target.value;
                      const newSlug = generateSlug(newTitleAr) || generateSlug(formData.title);
                      setFormData({
                        ...formData,
                        titleAr: newTitleAr,
                        slug: newSlug,
                      });
                    }}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="contentAr">
                    {isArabic ? 'المحتوى' : 'Content'} *
                  </Label>
                  <TiptapEditor
                    content={formData.contentAr}
                    onChange={(value) =>
                      setFormData({ ...formData, contentAr: value })
                    }
                    placeholder="ابدأ الكتابة..."
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="excerptAr">
                    {isArabic ? 'الملخص' : 'Excerpt'}
                  </Label>
                  <Textarea
                    id="excerptAr"
                    value={formData.excerptAr}
                    onChange={(e) =>
                      setFormData({ ...formData, excerptAr: e.target.value })
                    }
                    rows={3}
                    className="mt-1"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label htmlFor="title">
                    {isArabic ? 'العنوان' : 'Title'} *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      const newSlug = generateSlug(formData.titleAr) || generateSlug(newTitle);
                      setFormData({
                        ...formData,
                        title: newTitle,
                        slug: newSlug,
                      });
                    }}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="content">
                    {isArabic ? 'المحتوى' : 'Content'} *
                  </Label>
                  <TiptapEditor
                    content={formData.content}
                    onChange={(value) => setFormData({ ...formData, content: value })}
                    placeholder="Start writing..."
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt">
                    {isArabic ? 'الملخص' : 'Excerpt'}
                  </Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData({ ...formData, excerpt: e.target.value })
                    }
                    rows={3}
                    className="mt-1"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'الصورة الرئيسية' : 'Featured Image'}</CardTitle>
          </CardHeader>
          <CardContent>
            <AddImage
              value={formData.featuredImage}
              onChange={(url) => setFormData({ ...formData, featuredImage: url })}
              uploadOnly={true}
              table="blog"
              tableField="featuredImage"
              folder="blog"
              autoUpload={true}
              className="w-full"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'SEO' : 'SEO Settings'}</CardTitle>
          </CardHeader>
          <CardContent>
            <SEOFields
              seoTitle={formData.seoTitle}
              seoDescription={formData.seoDescription}
              keywords={formData.keywords}
              onSeoTitleChange={(value) =>
                setFormData({ ...formData, seoTitle: value })
              }
              onSeoDescriptionChange={(value) =>
                setFormData({ ...formData, seoDescription: value })
              }
              onKeywordsChange={(keywords) =>
                setFormData({ ...formData, keywords })
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'الإعدادات' : 'Settings'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="author">
                {isArabic ? 'المؤلف' : 'Author'} *
              </Label>
              <Input
                id="author"
                value={formData.authorName}
                onChange={(e) =>
                  setFormData({ ...formData, authorName: e.target.value })
                }
                required
                placeholder={isArabic ? 'أدخل اسم المؤلف' : 'Enter author name'}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="categories">
                {isArabic ? 'الفئات' : 'Categories'}
              </Label>
              <div className="space-y-2 mt-2">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.categoryIds.includes(category.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            categoryIds: [...formData.categoryIds, category.id],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            categoryIds: formData.categoryIds.filter(
                              (id) => id !== category.id
                            ),
                          });
                        }
                      }}
                    />
                    <span>
                      {isArabic && category.nameAr
                        ? category.nameAr
                        : category.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="tags">{isArabic ? 'الوسوم' : 'Tags'}</Label>
              <div className="space-y-2 mt-2">
                {tags.map((tag) => (
                  <label
                    key={tag.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.tagIds.includes(tag.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            tagIds: [...formData.tagIds, tag.id],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            tagIds: formData.tagIds.filter((id) => id !== tag.id),
                          });
                        }
                      }}
                    />
                    <span>
                      {isArabic && tag.nameAr ? tag.nameAr : tag.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) =>
                  setFormData({ ...formData, published: e.target.checked })
                }
                className="h-4 w-4"
              />
              <Label htmlFor="published" className="cursor-pointer">
                {isArabic ? 'نشر فوراً' : 'Publish immediately'}
              </Label>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

