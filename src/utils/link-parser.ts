export const LINK_REGEX = /\[\[(.*?)\]\]/g;

export const extractLinks = (content: string): string[] => {
  const links: string[] = [];
  let match;
  // Reset regex state
  LINK_REGEX.lastIndex = 0;
  while ((match = LINK_REGEX.exec(content)) !== null) {
    links.push(match[1]);
  }
  return [...new Set(links)]; // Return unique links
};
