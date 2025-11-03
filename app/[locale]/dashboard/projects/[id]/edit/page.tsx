'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from '@/lib/routing';
import {
  updateProject,
  getProjectById,
} from '@/app/actions/project/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AddImage from '@/components/AddImage';
import { SEOFields } from '@/components/dashboard/blog/SEOFields';

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const locale = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [postLocale, setPostLocale] = useState<'ar' | 'en'>('ar');

  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    slug: '',
    description: '',
    descriptionAr: '',
    featuredImage: '',
    startDate: '',
    endDate: '',
    published: false,
    featured: false,
    locale: locale as 'ar' | 'en',
    seoTitle: '',
    seoDescription: '',
    keywords: [] as string[],
  });

  const [projectId, setProjectId] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      const resolvedParams = await params;
      setProjectId(resolvedParams.id);
      const project = await getProjectById(resolvedParams.id);

      if (project) {
        const projectLocaleValue = (project.locale === 'ar' || project.locale === 'en') ? project.locale : 'ar';
        setPostLocale(projectLocaleValue);
        setFormData({
          name: project.name || '',
          nameAr: project.nameAr || '',
          slug: project.slug,
          description: project.description || '',
          descriptionAr: project.descriptionAr || '',
          featuredImage: project.featuredImage || '',
          startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
          endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
          published: project.published,
          featured: project.featured,
          locale: projectLocaleValue,
          seoTitle: project.seoTitle || '',
          seoDescription: project.seoDescription || '',
          keywords: project.keywords || [],
        });
      }

      setLoading(false);
    };

    loadData();
  }, [params]);

  const generateSlug = (text: string) => {
    if (!text) return '';
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) return;
    
    setSaving(true);
    const result = await updateProject(projectId, {
      ...formData,
      startDate: formData.startDate ? new Date(formData.startDate) : undefined,
      endDate: formData.endDate ? new Date(formData.endDate) : undefined,
    });

    if (result.success) {
      router.push('/dashboard/projects');
    } else {
      alert(result.error || 'Failed to update project');
    }

    setSaving(false);
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
            {isArabic ? 'تعديل المشروع' : 'Edit Project'}
          </h1>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard/projects')}
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
            <CardTitle>{isArabic ? 'معلومات المشروع' : 'Project Information'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {postLocale === 'ar' ? (
              <>
                <div>
                  <Label htmlFor="nameAr">
                    {isArabic ? 'اسم المشروع' : 'Project Name'} *
                  </Label>
                  <Input
                    id="nameAr"
                    value={formData.nameAr}
                    onChange={(e) => {
                      const newNameAr = e.target.value;
                      const newSlug = generateSlug(newNameAr) || generateSlug(formData.name);
                      setFormData({
                        ...formData,
                        nameAr: newNameAr,
                        slug: newSlug,
                      });
                    }}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="descriptionAr">
                    {isArabic ? 'الوصف' : 'Description'} *
                  </Label>
                  <Textarea
                    id="descriptionAr"
                    value={formData.descriptionAr}
                    onChange={(e) =>
                      setFormData({ ...formData, descriptionAr: e.target.value })
                    }
                    rows={6}
                    required
                    className="mt-1"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label htmlFor="name">
                    {isArabic ? 'اسم المشروع' : 'Project Name'} *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => {
                      const newName = e.target.value;
                      const newSlug = generateSlug(formData.nameAr) || generateSlug(newName);
                      setFormData({
                        ...formData,
                        name: newName,
                        slug: newSlug,
                      });
                    }}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">
                    {isArabic ? 'الوصف' : 'Description'} *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={6}
                    required
                    className="mt-1"
                  />
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">
                  {isArabic ? 'تاريخ البداية' : 'Start Date'}
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="endDate">
                  {isArabic ? 'تاريخ النهاية' : 'End Date'}
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
            </div>
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
              table="projects"
              tableField="featuredImage"
              folder="projects"
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

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData({ ...formData, featured: e.target.checked })
                }
                className="h-4 w-4"
              />
              <Label htmlFor="featured" className="cursor-pointer">
                {isArabic ? 'مميز' : 'Featured Project'}
              </Label>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

