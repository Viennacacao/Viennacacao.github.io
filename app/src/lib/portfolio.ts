export type PortfolioGroup = {
  id: string;
  title: string;
  description: string;
  images: string[];
};

export type PortfolioProject = {
  id: number;
  title: string;
  category: string;
  description: string;
  previewImages: string[];
  groups: PortfolioGroup[];
};

type CreateProjectInput = Omit<PortfolioProject, 'previewImages'> & {
  previewImages?: string[];
};

const flattenGroups = (groups: PortfolioGroup[]) => groups.flatMap((g) => g.images);

const createProject = (input: CreateProjectInput): PortfolioProject => {
  const allImages = flattenGroups(input.groups);
  return {
    ...input,
    previewImages: input.previewImages ?? allImages.slice(0, 6),
  };
};

export const portfolioProjects: PortfolioProject[] = [
  createProject({
    id: 1,
    title: '都市织影',
    category: '城市',
    description: '穿行在街巷与天际线之间，记录每座城市独有的节奏。',
    groups: [
      {
        id: 'city',
        title: '城市风光',
        description: '光与影，是城市的灵魂。',
        images: [
          '/images/city/city-1.jpg',
          '/images/city/city-2.jpg',
          '/images/city/city-3.jpg',
          '/images/city/city-4.jpg',
          '/images/city/city-5.jpg',
          '/images/city/city-6.JPG',
        ],
      },
      {
        id: 'osaka',
        title: '大阪',
        description: '大阪的街道，是城市的中心，也是城市的边界。',
        images: [
          '/images/city/osaka-1.jpg',
          '/images/city/osaka-2.jpg',
          '/images/city/osaka-3.JPG',
          '/images/city/osaka-4.JPG',
          '/images/city/osaka-7.jpg',
          '/images/city/osaka-9.jpg',
        ],
      },
      {
        id: 'kyoto',
        title: '京都',
        description: '古色古香的街道，宁静而充满文化气息。',
        images: [
          '/images/city/Kyoto-1.jpg',
          '/images/city/Kyoto-2.jpg',
          '/images/city/Kyoto-3.JPG',
          '/images/city/Kyoto-4.jpg',
          '/images/city/Kyoto-5.PNG',
          '/images/city/Kyoto-6.JPG',
          '/images/city/Kyoto-8.JPG',
          '/images/city/Kyoto-9.jpg',
        ],
      },
      {
        id: 'tokyo',
        title: '东京',
        description: '城市的速度与密度，构成了一个永远醒着的城市。',
        images: [
          '/images/city/Tokyo-1.jpg',
          '/images/city/Tokyo-2.jpg',
          '/images/city/Tokyo-3.jpg',
          '/images/city/Tokyo-4.jpg',
          '/images/city/Tokyo-5.jpg',
          '/images/city/Tokyo-6.jpg',
          '/images/city/Tokyo-7.jpg',
          '/images/city/Tokyo-8.jpg',
          '/images/city/Tokyo-9.JPG',
          '/images/city/Tokyo-10.jpg',
        ],
      },
      {
        id: 'takayama',
        title: '高山',
        description: '慢下来，感受山城街道与空气里微妙的温度。',
        images: [
          '/images/city/takayama-1.jpg',
          '/images/city/takayama-3.jpg',
          '/images/city/takayama-4.jpg',
          '/images/city/takayama-5.jpg',
          '/images/city/takayama-6.JPG',
          '/images/city/takayama-7.jpg',
        ],
      },
      {
        id: ' Sydney',
        title: '悉尼',
        description: '在繁忙与繁华中，寻找悉尼的独特气质。',
        images: [
          '/images/city/Sydney-1.jpg',
          '/images/city/Sydney-2.jpg',
          '/images/city/Sydney-4.jpg',
          '/images/nature/Sydney-5.jpg',
          '/images/nature/Sydney-7.JPG',
        ],
      },
      {
      id: 'golden coast',
      title: '黄金海岸',
      description: '在黄金海岸，你可以找到最接近原始的光。',
      images: [
        '/images/city/golden-1.jpg',
        '/images/city/golden-2.jpg',
        '/images/city/golden-3.jpg',
        '/images/city/golden-4.jpg',
        '/images/city/golden-5.jpg',
        '/images/city/golden-6.jpg',
      ],
      },
      {
        id: 'bangkok',
        title: '曼谷',
        description: '曼谷，一个充满活力与魅力的城市，让人流连忘返。',
        images: [
          '/images/city/bangkok-1.jpg',
          '/images/city/bangkok-2.jpg',
          '/images/city/bangkok-3.jpg',
          '/images/city/bangkok-4.jpg',
          '/images/city/bangkok-5.jpg',
          '/images/city/bangkok-0-2.jpg',
          '/images/city/bangkok-28.JPG',
        ],
      },
    ],

  }),
  createProject({
    id: 2,
    title: '旷野遐想',
    category: '自然',
    description: '在风与云之间，收集更接近原始的光。',
    groups: [
      {
        id: 'xinsuigao',
        title: '新穗高',
        description: '日本北陆的新穗高，是一个神秘的区域。',
        images: [
          '/images/cultural/xinsuigao-6.JPG',
          '/images/cultural/xinsuigao-9.jpg',
          '/images/cultural/xinsuigao-14.jpg',
          '/images/cultural/xinsuigao-15.JPG',
          '/images/city/xinsuigao-1.jpg',
          '/images/city/xinsuigao-2.jpg',
        ],
      },
      {
        id: 'maple',
        title: '枫叶',
        description: '枫叶，是一种非常特殊的植物，它的叶子有独特的形状。',
        images: [
          '/images/cultural/Kyoto-20.JPG',
          '/images/cultural/Kyoto-21.JPG',
          '/images/cultural/Kyoto-22.jpg',
          '/images/cultural/Kyoto-23.jpg',
          '/images/cultural/Kyoto-24.jpg',
          '/images/cultural/Kyoto-25.jpg',
          '/images/cultural/Kyoto-26.jpg',
          '/images/cultural/Kyoto-27.JPG',
        ],
      },
      {
        id: 'beach',
        title: '海滩', // TODO: Change title
        description: '阳光与沙滩，美丽在此刻绽放。',
        images: [
          '/images/cultural/noosa-1.jpg',
          '/images/cultural/noosa-2.jpg',
          '/images/cultural/noosa-3.jpg',
          '/images/cultural/noosa-7.JPG',
          '/images/cultural/noosa-8.jpeg',
          '/images/cultural/noosa-9.JPG',
          '/images/nature/cronulla-1.JPG',
          '/images/nature/cronulla-2.JPG',
          '/images/nature/cronulla-3.JPG',
          '/images/nature/cronulla-4.JPG',
          '/images/nature/cronulla-5.JPG',
        ],
      },
    ],
  }),
  createProject({
    id: 3,
    title: '文融山水',
    category: '人文',
    description: '人的痕迹与自然的尺度，在同一帧里相遇。',
    groups: [
      {
        id: 'space',
        title: '空间',
        description: '光落下的地方，构成了人活动的边界。',
        images: [
          '/images/city/daohe-0.JPG',
          '/images/city/daohe-1.jpg',
          '/images/city/daohe-2.jpg',
          '/images/city/daohe-3.jpg',
          '/images/cultural/montville-2.JPG',
        ],
      },
      {
        id: 'texture',
        title: '纹理',
        description: '材质与细节，是时间留下的触感。',
        images: [
          '/images/city/bulishiban-1.jpg',
          '/images/city/bulishiban-6.JPG',
          '/images/city/bulishiban-7.JPG',
          '/images/cultural/garden-8.jpg',
          '/images/cultural/garden-10.jpg',
        ],
      },
      {
        id: 'silence',
        title: '静处',
        description: '更慢的节奏里，更容易看见真实。',
        images: [
          '/images/cultural/fuji-4.jpg',
          '/images/cultural/fuji-5.jpg',
          '/images/city/baichuanxiang-1.jpg',
          '/images/city/baichuanxiang-2.jpg',
          '/images/city/montville-1.jpg',
        ],
      },
    ],
  }),
  createProject({
    id: 4,
    title: '心野逐欢',
    category: '生活',
    description: '把琐碎的日常，拍成可以反复回看的小片段。',
    groups: [
      {
        id: 'people',
        title: '人间',
        description: '人与人之间的距离，往往在一瞬间被拉近。',
        images: [
          '/images/city/anaya-1.jpg',
          '/images/city/baichuanxiang-1.jpg',
          '/images/city/baichuanxiang-2.jpg',
        ],
      },
      {
        id: 'street',
        title: '街角',
        description: '光影拐弯处，最容易遇到故事。',
        images: [
          '/images/city/nara-0.JPG',
          '/images/city/nara-1.jpg',
          '/images/city/wakayama-5.jpg',
          '/images/city/wakayama-6.jpg',
        ],
      },
      {
        id: 'daily',
        title: '日常',
        description: '不需要宏大叙事，也足够动人。',
        images: [
          '/images/city/life-1.jpg',
          '/images/city/montville-1.jpg',
          '/images/city/bulishiban-1.jpg',
        ],
      },
    ],
  }),
];

export const getProjectById = (id: number) => portfolioProjects.find((p) => p.id === id);

export const getProjectAllImages = (project: PortfolioProject) => flattenGroups(project.groups);

export type ProjectImageMeta = {
  src: string;
  groupId: string;
  groupTitle: string;
  groupIndex: number;
  globalIndex: number;
};

export const getProjectImageMetaList = (project: PortfolioProject): ProjectImageMeta[] => {
  const meta: ProjectImageMeta[] = [];
  let globalIndex = 0;
  project.groups.forEach((g) => {
    g.images.forEach((src, groupIndex) => {
      meta.push({
        src,
        groupId: g.id,
        groupTitle: g.title,
        groupIndex,
        globalIndex,
      });
      globalIndex += 1
    });
  });
  return meta;
};

export const getProjectImageMetaByIndex = (project: PortfolioProject, index: number) =>
  getProjectImageMetaList(project)[index];
