export interface HighlightResult {
  name: {
    value: string;
    matchLevel: string;
    fullyHighlighted: boolean;
    matchedWords: string[];
  };
  tags: Array<{
    value: string;
    matchLevel: string;
    matchedWords: string[];
  }>;
}
