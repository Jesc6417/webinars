export interface QueryStore {
  store(id: string): Promise<void>;
}
