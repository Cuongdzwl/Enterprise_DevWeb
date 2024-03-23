export interface IDTO<T, TDTO> {
  map(map: T): TDTO;
}
