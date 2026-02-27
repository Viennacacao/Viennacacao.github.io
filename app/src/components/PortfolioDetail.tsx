import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Grid3X3, LayoutList, Heart, Play } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lightbox from './Lightbox';
import Slideshow from './Slideshow';
import FavoritesGallery, { FavoriteButton } from './Favorites';
import { getImageLoadingProps, getOptimizedImageSources } from '../lib/image';
import {
  getProjectAllImages,
  getProjectById,
  getProjectImageMetaList,
} from '../lib/portfolio';

gsap.registerPlugin(ScrollTrigger);

const PortfolioDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
  const [slideshowOpen, setSlideshowOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);

  const projectId = Number(id);
  const project = Number.isFinite(projectId) ? getProjectById(projectId) : undefined;
  const allImages = project ? getProjectAllImages(project) : [];
  const imageMetaList = project ? getProjectImageMetaList(project) : [];
  const imageMetaBySrc = new Map(imageMetaList.map((m) => [m.src, m]));
  const activeMeta = project ? imageMetaList[lightboxIndex] : undefined;

  useEffect(() => {
    if (!project) {
      navigate('/');
      return;
    }

    const ctx = gsap.context(() => {
      const scrollTriggers: ScrollTrigger[] = [];

      // Header animation
      const header = sectionRef.current?.querySelector('.detail-header');
      if (header) {
        const st = ScrollTrigger.create({
          trigger: header,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            gsap.fromTo(
              header.querySelectorAll('.animate-item'),
              { y: 40, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: 'expo.out',
              }
            );
          },
        });
        scrollTriggers.push(st);
      }

      // Gallery items animation
      const items = sectionRef.current?.querySelectorAll('.gallery-item');
      if (items) {
        items.forEach((item, index) => {
          const st = ScrollTrigger.create({
            trigger: item,
            start: 'top 85%',
            once: true,
            onEnter: () => {
              gsap.fromTo(
                item,
                { y: 60, opacity: 0, scale: 0.95 },
                {
                  y: 0,
                  opacity: 1,
                  scale: 1,
                  duration: 0.6,
                  ease: 'expo.out',
                  delay: (index % 3) * 0.1,
                }
              );
            },
          });
          scrollTriggers.push(st);
        });
      }

      return () => {
        scrollTriggers.forEach((st) => st.kill());
      };
    }, sectionRef);

    return () => ctx.revert();
  }, [project, navigate]);

  // Keyboard navigation for gallery
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxOpen || slideshowOpen || favoritesOpen) return;
      
      if (e.key === 'ArrowLeft' && lightboxIndex > 0) {
        setLightboxIndex((prev) => prev - 1);
      } else if (e.key === 'ArrowRight' && project && lightboxIndex < allImages.length - 1) {
        setLightboxIndex((prev) => prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, slideshowOpen, favoritesOpen, lightboxIndex, project, allImages.length]);

  if (!project) return null;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-black pt-24 pb-16"
    >
      <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16">
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-300 mb-8"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform duration-300"
          />
          <span className="text-sm font-mono uppercase tracking-wider">返回</span>
        </button>

        {/* Header */}
        <div className="detail-header mb-12">
          <div className="flex items-center gap-4 mb-4">
            <span className="animate-item inline-block text-xs font-mono uppercase tracking-widest text-white/50">
              {project.category}
            </span>
          </div>
          <h1 className="animate-item text-4xl sm:text-5xl lg:text-6xl font-normal text-white mb-6">
            {project.title}
          </h1>
          <p className="animate-item text-base sm:text-lg text-white/60 max-w-2xl leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Groups navigation */}
        <div className="flex flex-wrap gap-2 mb-10">
          {project.groups.map((g) => (
            <button
              key={g.id}
              onClick={() => {
                document.getElementById(`group-${g.id}`)?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                });
              }}
              className="px-3 py-1.5 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all duration-300 text-sm"
            >
              <span className="font-mono uppercase tracking-wider">{g.title}</span>
              <span className="ml-2 text-xs text-white/40 font-mono">{g.images.length}</span>
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/40 font-mono">
              共 {allImages.length} 张照片
            </span>
            
            {/* Slideshow button */}
            <button
              onClick={() => setSlideshowOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all duration-300 text-sm"
            >
              <Play size={14} />
              <span>幻灯片</span>
            </button>

            {/* Favorites button */}
            <button
              onClick={() => setFavoritesOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all duration-300 text-sm"
            >
              <Heart size={14} />
              <span>收藏夹</span>
            </button>
          </div>

          {/* View mode toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-300 ${
                viewMode === 'grid'
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
              aria-label="Grid view"
            >
              <Grid3X3 size={18} />
            </button>
            <button
              onClick={() => setViewMode('masonry')}
              className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-300 ${
                viewMode === 'masonry'
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
              aria-label="Masonry view"
            >
              <LayoutList size={18} />
            </button>
          </div>
        </div>

        {/* Gallery */}
        <div className="space-y-14">
          {project.groups.map((group) => (
            <div
              key={group.id}
              id={`group-${group.id}`}
              className="scroll-mt-28"
            >
              <div className="mb-6">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="text-2xl sm:text-3xl font-normal text-white">
                    {group.title}
                  </h2>
                  <span className="text-xs text-white/40 font-mono">
                    {group.images.length} 张
                  </span>
                </div>
                <p className="mt-2 text-sm sm:text-base text-white/50 max-w-2xl leading-relaxed">
                  {group.description}
                </p>
              </div>

              <div
                className={`grid gap-4 sm:gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-2 md:grid-cols-3'
                    : 'grid-cols-2 md:grid-cols-3 auto-rows-[200px]'
                }`}
              >
                {group.images.map((image, index) => {
                  const meta = imageMetaBySrc.get(image);
                  const globalIndex = meta?.globalIndex ?? 0;
                  const favCategory = meta ? `${project.category} / ${meta.groupTitle}` : project.category;

                  return (
                    <div
                      key={image}
                      className={`gallery-item group relative overflow-hidden rounded-lg cursor-pointer opacity-0 ${
                        viewMode === 'masonry'
                          ? index % 3 === 0
                            ? 'row-span-2'
                            : ''
                          : 'aspect-[4/3]'
                      }`}
                      onClick={() => openLightbox(globalIndex)}
                    >
                      {(() => {
                        const { sources, imgSrc } = getOptimizedImageSources({
                          src: image,
                          sizes: '(max-width: 768px) 50vw, 33vw',
                          widths: [320, 480, 640, 960, 1280],
                        });
                        const loadingProps = getImageLoadingProps();
                        return (
                          <picture>
                            {sources.map((s) => (
                              <source key={s.type} type={s.type} srcSet={s.srcSet} sizes={s.sizes} />
                            ))}
                            <img
                              src={imgSrc}
                              alt={`${project.title} ${group.title} ${index + 1}`}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              style={{ transitionTimingFunction: 'var(--ease-expo-out)' }}
                              {...loadingProps}
                            />
                          </picture>
                        );
                      })()}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300">
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <FavoriteButton
                            image={image}
                            projectTitle={project.title}
                            category={favCategory}
                          />
                        </div>

                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 text-white text-sm font-mono uppercase tracking-wider transition-opacity duration-300">
                            查看
                          </span>
                        </div>
                      </div>

                      <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-xs text-white/80 font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {index + 1}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation hint */}
        <div className="mt-12 text-center">
          <p className="text-sm text-white/40 font-mono">
            使用键盘 ← → 键快速浏览图片
          </p>
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        images={allImages}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setLightboxIndex}
        title={
          activeMeta
            ? `${project.title} · ${activeMeta.groupTitle} ${activeMeta.groupIndex + 1}`
            : `${project.title} ${lightboxIndex + 1}`
        }
        description={
          activeMeta
            ? `${project.category} / ${activeMeta.groupTitle}`
            : `${project.category} 摄影系列`
        }
        projectTitle={project.title}
        category={
          activeMeta ? `${project.category} / ${activeMeta.groupTitle}` : project.category
        }
      />

      {/* Slideshow */}
      <Slideshow
        images={allImages}
        titles={imageMetaList.map((m) => `${project.title} · ${m.groupTitle} ${m.groupIndex + 1}`)}
        isOpen={slideshowOpen}
        onClose={() => setSlideshowOpen(false)}
        initialIndex={lightboxIndex}
      />

      {/* Favorites Gallery */}
      <FavoritesGallery
        isOpen={favoritesOpen}
        onClose={() => setFavoritesOpen(false)}
      />
    </section>
  );
};

export default PortfolioDetail;
