'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from '@/lib/routing';
import { createProject, addProjectImage } from '@/app/actions/project/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AddImage from '@/components/AddImage';
import { SEOFields } from '@/components/dashboard/blog/SEOFields';
import { X } from 'lucide-react';

export default function NewProjectPage() {
  const locale = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const isArabic = locale === 'ar';

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
    locale: locale,
    seoTitle: '',
    seoDescription: '',
    keywords: [] as string[],
  });

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

    // Validate required fields based on current locale
    if (isArabic) {
      if (!formData.nameAr.trim()) {
        alert('يرجى إدخال اسم المشروع');
        return;
      }
      if (!formData.descriptionAr.trim()) {
        alert('يرجى إدخال وصف المشروع');
        return;
      }
    } else {
      if (!formData.name.trim()) {
        alert('Please enter the project name');
        return;
      }
      if (!formData.description.trim()) {
        alert('Please enter the project description');
        return;
      }
    }

    setLoading(true);

    try {
      // Ensure both name and nameAr are sent (even if empty)
      const submitData = {
        ...formData,
        name: formData.name || '',
        nameAr: formData.nameAr || '',
        locale: locale as 'ar' | 'en',
        startDate: formData.startDate ? new Date(formData.startDate) : undefined,
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      };

      const result = await createProject(submitData);

      if (result.success && result.project) {
        // Add all gallery images to the newly created project
        if (galleryImages.length > 0) {
          try {
            await Promise.all(
              galleryImages.map((imageUrl, index) =>
                addProjectImage(result.project!.id, {
                  imageUrl,
                  alt: '',
                  altAr: '',
                  order: index,
                })
              )
            );
          } catch (error) {
            console.error('Error adding gallery images:', error);
            // Continue even if gallery images fail - project is already created
          }
        }
        router.push('/dashboard/projects');
      } else {
        alert(result.error || (isArabic ? 'فشل في إنشاء المشروع' : 'Failed to create project'));
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert(isArabic ? 'حدث خطأ أثناء إنشاء المشروع' : 'An error occurred while creating the project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            {isArabic ? 'مشروع جديد' : 'New Project'}
          </h1>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard/projects')}
            >
              {isArabic ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
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
            {isArabic ? (
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
                      const newSlug = generateSlug(newNameAr);
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
                      const newSlug = generateSlug(newName);
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
              onChange={(url: string) => setFormData({ ...formData, featuredImage: url })}
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
            <CardTitle>{isArabic ? 'معرض الصور' : 'Image Gallery'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>{isArabic ? 'إضافة صورة للمعرض' : 'Add Image to Gallery'}</Label>
              <p className="text-sm text-muted-foreground mb-2">
                {isArabic
                  ? 'يمكنك إضافة صور الآن، وسيتم حفظها تلقائياً عند إنشاء المشروع'
                  : 'You can add images now, they will be saved automatically when you create the project'}
              </p>
              <AddImage
                onChange={(url: string) => {
                  if (url && !galleryImages.includes(url)) {
                    setGalleryImages([...galleryImages, url]);
                  }
                }}
                uploadOnly={true}
                table="projects"
                folder="projects/gallery"
                autoUpload={true}
                className="w-full mt-2"
              />
            </div>

            {galleryImages.length > 0 && (
              <div>
                <Label className="mb-2 block">
                  {isArabic ? 'الصور المضافة' : 'Added Images'} ({galleryImages.length})
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
                  {galleryImages.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <div className="relative w-full aspect-square bg-muted rounded-md overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={`Gallery image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setGalleryImages(galleryImages.filter((_, i) => i !== index));
                          }}
                          className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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

