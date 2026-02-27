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
        id: 'osaka',
        title: '大阪',
        description: '大阪的街道，是城市的中心，也是城市的边界。',
        images: ['/images/osaka-1.jpg', '/images/osaka-2.jpg', '/images/osaka-3.jpg', '/images/osaka-4.jpg', '/images/osaka-5.jpg'],
      },
      {
        id: 'kyoto',
        title: '京都',
        description: '古色古香的街道，宁静而充满文化气息。',
        images: ['/images/Kyoto-1.jpg', '/images/Kyoto-2.jpg', '/images/Kyoto-3.jpg', '/images/Kyoto-4.jpg', '/images/Kyoto-5.jpg', '/images/Kyoto-6.jpg'],
      },
      {
        id: 'tokyo',
        title: '东京',
        description: '城市的速度与密度，构成了一个永远醒着的城市。',
        images: ['/images/Tokyo-1.jpg', '/images/Tokyo-2.jpg', '/images/Tokyo-3.jpg', '/images/Tokyo-4.jpg', '/images/Tokyo-5.jpg', '/images/Tokyo-6.jpg', '/images/Tokyo-7.jpg', '/images/Tokyo-8.jpg', '/images/Tokyo-9.jpg', '/images/Tokyo-10.jpg'],
      },
      {
        id: 'takayama',
        title: '高山',
        description: '慢下来，感受山城街道与空气里微妙的温度。',
        images: ['/images/takayama-1.jpg', '/images/takayama-2.jpg', '/images/takayama-3.jpg', '/images/takayama-4.jpg', '/images/takayama-5.jpg', '/images/takayama-6.jpg'],
      },
      {
        id: ' Sydney',
        title: '悉尼',
        description: '在繁忙与繁华中，寻找悉尼的独特气质。',
        images: ['/images/Sydney-1.jpg', '/images/Sydney-2.jpg', '/images/Sydney-3.jpg', '/images/Sydney-4.jpg', '/images/Sydney-5.jpg'],
      },
      {
      id: 'golden coast',
      title: '黄金海岸',
      description: '在黄金海岸，你可以找到最接近原始的光。',
      images: ['/images/golden-1.jpg', '/images/golden-2.jpg', '/images/golden-3.jpg', '/images/golden-4.jpg', '/images/golden-5.jpg'],
      }
    ],

  }),
  createProject({
    id: 2,
    title: '旷野遐想',
    category: '自然',
    description: '在风与云之间，收集更接近原始的光。',
    groups: [
      {
        id: 'mountain',
        title: '山脊',
        description: '线条与层次，是山脉最清晰的语言。',
        images: ['/images/wild-1.jpg', '/images/wild-2.jpg'],
      },
      {
        id: 'valley',
        title: '溪谷',
        description: '湿润的空气与柔和的明暗，藏着更安静的声音。',
        images: ['/images/wild-3.jpg', '/images/wild-4.jpg'],
      },
      {
        id: 'sky',
        title: '天光',
        description: '短暂但决定性的瞬间，让一切变得不一样。',
        images: ['/images/wild-5.jpg', '/images/wild-6.jpg'],
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
        images: ['/images/light-1.jpg', '/images/light-2.jpg'],
      },
      {
        id: 'texture',
        title: '纹理',
        description: '材质与细节，是时间留下的触感。',
        images: ['/images/light-3.jpg', '/images/light-4.jpg'],
      },
      {
        id: 'silence',
        title: '静处',
        description: '更慢的节奏里，更容易看见真实。',
        images: ['/images/light-5.jpg', '/images/light-6.jpg'],
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
        images: ['/images/life-1.jpg', '/images/life-2.jpg'],
      },
      {
        id: 'street',
        title: '街角',
        description: '光影拐弯处，最容易遇到故事。',
        images: ['/images/life-3.jpg', '/images/life-4.jpg'],
      },
      {
        id: 'daily',
        title: '日常',
        description: '不需要宏大叙事，也足够动人。',
        images: ['/images/life-5.jpg', '/images/life-6.jpg'],
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
      globalIndex += 1;
    });
  });
  return meta;
};

export const getProjectImageMetaByIndex = (project: PortfolioProject, index: number) =>
  getProjectImageMetaList(project)[index];

