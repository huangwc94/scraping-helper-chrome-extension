export interface SelectData {
  selectedCount: number;
  selected: boolean;
  suggestSelector: string;
  htmls: string[];
  success: boolean;
}

export type DataElement = HTMLElement & Element & Node;

export interface AppState {
  app: SelectData;
}

export function mapAppStateToProps({ app }: { app: SelectData }) {
  return { app };
}

export function GetDefaultData() {
  return {
    selected: false,
    success: false,
    selectedCount: 0,
    suggestSelector: '',
    htmls: [],
  };
}
