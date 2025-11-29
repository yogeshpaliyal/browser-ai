export const createModelMonitor = (onProgress: (progress: number) => void) => {
  return (m: any) => {
    m.addEventListener("downloadprogress", (e: any) => {
      onProgress(e.loaded * 100);
    });
  };
};
