import Location from "../domain/Location";

export interface LocationRepository {
  create(location: Location): Promise<Location>;
  findById(id: number): Promise<Location | null>;
}
