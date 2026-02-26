import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Grid3X3, LayoutList, Heart, Play } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lightbox from './Lightbox';
import Slideshow from './Slideshow';
import FavoritesGallery, { FavoriteButton } from './Favorites';
import { getImageLoadingProps, getOptimizedImageSources } from '../lib/image';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  images: string[];
}

const projects: Project[] = [
  {
    id: 1,
    title: '城市建筑',
    category: '建筑',
    description: '探索城市环境中的几何形态与光影之美。从摩天大楼的玻璃幕墙到螺旋楼梯的优美曲线，每一张照片都试图捕捉建筑空间的独特魅力。',
    images: [
      '/images/urban-1.jpg',
      '/images/urban-2.jpg',
      '/images/urban-3.jpg',
      '/images/urban-4.jpg',
      '/images/urban-5.jpg',
      '/images/urban-6.jpg',
    ],
  },
  {
    id: 2,
    title: '旷野遐想',
    category: '自然',
    description: '捕捉原始风景的宁静与壮丽。从蜿蜒的河流到广袤的沙漠，从雾气缭绕的山谷到皑皑白雪，大自然的美无处不在。',
    images: [
      '/images/wild-1.jpg',
      '/images/wild-2.jpg',
      '/images/wild-3.jpg',
      '/images/wild-4.jpg',
      '/images/wild-5.jpg',
      '/images/wild-6.jpg',
    ],
  },
  {
    id: 3,
    title: '建筑光影',
    category: '建筑',
    description: '光与影在建筑空间中的戏剧性互动。光线透过百叶窗投射出的条纹、阳光从天窗倾泻而下的光束，每一束光都在讲述一个故事。',
    images: [
      '/images/light-1.jpg',
      '/images/light-2.jpg',
      '/images/light-3.jpg',
      '/images/light-4.jpg',
      '/images/light-5.jpg',
      '/images/light-6.jpg',
    ],
  },
  {
    id: 4,
    title: '生活碎片',
    category: '生活',
    description: '日常生活中稍纵即逝的瞬间与真实情感。公园长椅上的老人、雨后街道上的行人、咖啡馆窗边的宁静时光，这些都是生活最真实的写照。',
    images: [
      '/images/life-1.jpg',
      '/images/life-2.jpg',
      '/images/life-3.jpg',
      '/images/life-4.jpg',
      '/images/life-5.jpg',
      '/images/life-6.jpg',
    ],
  },
];

const PortfolioDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
  const [slideshowOpen, setSlideshowOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);

  const project = projects.find((p) => p.id === Number(id));

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
      } else if (e.key === 'ArrowRight' && project && lightboxIndex < project.images.length - 1) {
        setLightboxIndex((prev) => prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, slideshowOpen, favoritesOpen, lightboxIndex, project]);

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

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/40 font-mono">
              共 {project.images.length} 张照片
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
        <div
          className={`grid gap-4 sm:gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-2 md:grid-cols-3'
              : 'grid-cols-2 md:grid-cols-3 auto-rows-[200px]'
          }`}
        >
          {project.images.map((image, index) => (
            <div
              key={index}
              className={`gallery-item group relative overflow-hidden rounded-lg cursor-pointer opacity-0 ${
                viewMode === 'masonry'
                  ? index % 3 === 0
                    ? 'row-span-2'
                    : ''
                  : 'aspect-[4/3]'
              }`}
              onClick={() => openLightbox(index)}
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
                      alt={`${project.title} ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      style={{ transitionTimingFunction: 'var(--ease-expo-out)' }}
                      {...loadingProps}
                    />
                  </picture>
                );
              })()}
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300">
                {/* Favorite button */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <FavoriteButton
                    image={image}
                    projectTitle={project.title}
                    category={project.category}
                  />
                </div>
                
                {/* View text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 text-white text-sm font-mono uppercase tracking-wider transition-opacity duration-300">
                    查看
                  </span>
                </div>
              </div>
              
              {/* Index badge */}
              <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-xs text-white/80 font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {index + 1}
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
        images={project.images}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setLightboxIndex}
        title={`${project.title} ${lightboxIndex + 1}`}
        description={`${project.category} 摄影系列`}
        projectTitle={project.title}
        category={project.category}
      />

      {/* Slideshow */}
      <Slideshow
        images={project.images}
        titles={project.images.map((_, i) => `${project.title} ${i + 1}`)}
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
