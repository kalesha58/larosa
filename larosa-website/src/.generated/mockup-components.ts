export const modules: Record<string, () => Promise<any>> = {
  "./components/mockups/HeroSample.tsx": () => import("../components/mockups/HeroSample"),
};
