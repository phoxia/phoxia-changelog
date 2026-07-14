export interface Release {
  product: string;
  version: string;
  title: string;
  date: string;
  summary: string;
  changes: string[];
  docsUrl: string;
  sourceUrl: string;
  breaking: boolean;
  compatibility?: string;
  migration?: string;
  rfcUrl?: string;
}
