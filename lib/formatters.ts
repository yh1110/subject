// 実際のアプリケーションで使用するユーティリティ関数

export const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num.toString();
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatSize = (kilobytes: number): string => {
  if (kilobytes >= 1024) {
    return (kilobytes / 1024).toFixed(1) + " MB";
  }
  return kilobytes + " KB";
};