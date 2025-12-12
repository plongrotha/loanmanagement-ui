export interface IColumnDef<T> {
  headerText: string; // Column header text
  field?: keyof T;
}
